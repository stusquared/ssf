import { Hono, type Context, type Next } from "hono";
import { handle } from "hono/cloudflare-pages";
import { z } from "zod";
import Stripe from "stripe";
import {
  sendEmail,
  csaNotification,
  csaAutoReply,
  contactNotification,
  contactAutoReply,
  type EmailEnv,
} from "../../lib/email";

type Bindings = EmailEnv & {
  DB: D1Database;
  FILES: R2Bucket;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  ADMIN_USER: string;
  ADMIN_PASS: string;
  ADMIN_SECRET: string;
};

// ─── Token helpers ────────────────────────────────────────────────────────────

async function createToken(secret: string): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + 86_400_000 });
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${btoa(payload)}.${sigB64}`;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const [dataB64, sigB64] = token.split(".");
    if (!dataB64 || !sigB64) return false;
    const payload = atob(dataB64);
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
    if (expected !== sigB64) return false;
    const { exp } = JSON.parse(payload) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

// ─── Auth middleware ──────────────────────────────────────────────────────────

async function adminAuth(c: Context<{ Bindings: Bindings }>, next: Next) {
  const auth = c.req.header("Authorization");
  if (!auth?.startsWith("Bearer ")) return c.json({ error: "Unauthorized" }, 401);
  if (!(await verifyToken(auth.slice(7), c.env.ADMIN_SECRET))) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
}

// ─── Stripe factory ───────────────────────────────────────────────────────────

function stripeClient(key: string) {
  return new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
}

// ─── Settings ─────────────────────────────────────────────────────────────────

const SALES_KEY = "csa_sales_enabled";

/**
 * Sales default to OPEN when the row is missing so a half-applied migration
 * cannot silently take the storefront offline.
 */
async function salesEnabled(db: D1Database): Promise<boolean> {
  const row = await db
    .prepare("SELECT value FROM settings WHERE key = ?")
    .bind(SALES_KEY)
    .first<{ value: string }>();
  return row ? row.value === "1" : true;
}

async function setSalesEnabled(db: D1Database, enabled: boolean): Promise<void> {
  await db
    .prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(SALES_KEY, enabled ? "1" : "0")
    .run();
}

// ─── Email helper (unchanged) ─────────────────────────────────────────────────

function deliverAfterResponse(
  c: { env: Bindings; executionCtx?: ExecutionContext },
  jobs: Array<Promise<void>>,
): void {
  const work = Promise.all(jobs).then(
    () => undefined,
    (err) => console.error("[email] delivery failed:", err),
  );
  try {
    c.executionCtx?.waitUntil(work);
  } catch {
    // No execution context in some local runners — ignore.
  }
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const csaSignupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().max(2000).optional(),
});

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
});

const productSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  price_cents: z.number().int().positive(),
  timeframe: z.string().min(1).max(200),
  total_spots: z.number().int().nonnegative(),
  spots_remaining: z.number().int().nonnegative(),
  is_active: z.boolean(),
});

const checkoutSchema = z.object({
  productId: z.number().int().positive(),
  customer: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().max(30).optional(),
    address_line1: z.string().min(1).max(200),
    address_line2: z.string().max(200).optional(),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(50),
    zip: z.string().min(1).max(20),
  }),
});

type CsaProduct = {
  id: number;
  name: string;
  description: string | null;
  price_cents: number;
  timeframe: string;
  total_spots: number;
  spots_remaining: number;
  is_active: number;
};

// ─── App ──────────────────────────────────────────────────────────────────────

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

// ─── Health ───────────────────────────────────────────────────────────────────

app.get("/health", (c) => c.json({ ok: true }));

// ─── Admin: login ─────────────────────────────────────────────────────────────

app.post("/admin/login", async (c) => {
  // Unset admin config is a server misconfiguration, not a bad password. Without
  // this guard every login fails as "invalid credentials" and the real cause —
  // a .dev.vars in the wrong place, or an unset Pages secret — stays hidden.
  if (!c.env.ADMIN_USER || !c.env.ADMIN_PASS || !c.env.ADMIN_SECRET) {
    console.error("[admin] ADMIN_USER, ADMIN_PASS, or ADMIN_SECRET is not set");
    return c.json({ error: "Admin login is not configured on this server." }, 500);
  }
  const body = await c.req.json().catch(() => null);
  if (!body?.username || !body?.password) {
    return c.json({ error: "Invalid credentials" }, 401);
  }
  if (body.username !== c.env.ADMIN_USER || body.password !== c.env.ADMIN_PASS) {
    return c.json({ error: "Invalid credentials" }, 401);
  }
  const token = await createToken(c.env.ADMIN_SECRET);
  return c.json({ token });
});

// ─── Admin: protected product routes ─────────────────────────────────────────

const admin = new Hono<{ Bindings: Bindings }>();
admin.use("*", adminAuth);

admin.get("/products", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM csa_products ORDER BY created_at DESC",
  ).all();
  return c.json(results);
});

admin.get("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const product = await c.env.DB.prepare(
    "SELECT * FROM csa_products WHERE id = ?",
  ).bind(id).first();
  if (!product) return c.json({ error: "Not found" }, 404);
  return c.json(product);
});

admin.post("/products", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.flatten() }, 400);
  }
  const { name, description, price_cents, timeframe, total_spots, spots_remaining, is_active } =
    parsed.data;
  const result = await c.env.DB.prepare(
    `INSERT INTO csa_products (name, description, price_cents, timeframe, total_spots, spots_remaining, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(name, description ?? null, price_cents, timeframe, total_spots, spots_remaining, is_active ? 1 : 0)
    .run();
  return c.json({ id: result.meta.last_row_id }, 201);
});

admin.put("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "Invalid input" }, 400);
  const { name, description, price_cents, timeframe, total_spots, spots_remaining, is_active } =
    parsed.data;
  await c.env.DB.prepare(
    `UPDATE csa_products
     SET name = ?, description = ?, price_cents = ?, timeframe = ?,
         total_spots = ?, spots_remaining = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
  )
    .bind(name, description ?? null, price_cents, timeframe, total_spots, spots_remaining, is_active ? 1 : 0, id)
    .run();
  return c.json({ ok: true });
});

admin.delete("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM csa_products WHERE id = ?").bind(id).run();
  return c.json({ ok: true });
});

admin.get("/settings", async (c) => {
  return c.json({ salesEnabled: await salesEnabled(c.env.DB) });
});

admin.put("/settings", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (typeof body?.salesEnabled !== "boolean") {
    return c.json({ error: "salesEnabled must be a boolean" }, 400);
  }
  await setSalesEnabled(c.env.DB, body.salesEnabled);
  return c.json({ salesEnabled: body.salesEnabled });
});

app.route("/admin", admin);

// ─── Public: CSA products ─────────────────────────────────────────────────────

app.get("/csa/products", async (c) => {
  const enabled = await salesEnabled(c.env.DB);
  // With sales closed the catalogue is withheld entirely — the page shows the
  // waitlist instead, so shipping the packages would only invite stale links.
  if (!enabled) return c.json({ salesEnabled: false, products: [] });
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM csa_products WHERE is_active = 1 ORDER BY created_at ASC",
  ).all();
  return c.json({ salesEnabled: true, products: results });
});

app.get("/csa/products/:id", async (c) => {
  if (!(await salesEnabled(c.env.DB))) {
    return c.json({ error: "CSA sales are currently closed." }, 403);
  }
  const id = Number(c.req.param("id"));
  const product = await c.env.DB.prepare(
    "SELECT * FROM csa_products WHERE id = ? AND is_active = 1",
  ).bind(id).first();
  if (!product) return c.json({ error: "Not found" }, 404);
  return c.json(product);
});

// ─── Checkout ─────────────────────────────────────────────────────────────────

app.post("/checkout", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.flatten() }, 400);
  }

  const { productId, customer } = parsed.data;

  // Enforced here too: hiding the buttons does not stop a stale tab or a
  // direct POST from creating a Stripe session after the client closes sales.
  if (!(await salesEnabled(c.env.DB))) {
    return c.json({ error: "CSA sales are currently closed." }, 403);
  }

  const product = await c.env.DB.prepare(
    "SELECT * FROM csa_products WHERE id = ? AND is_active = 1 AND spots_remaining > 0",
  )
    .bind(productId)
    .first<CsaProduct>();
  if (!product) return c.json({ error: "This package is not currently available." }, 400);

  // Upsert customer — update contact info if they've ordered before
  await c.env.DB.prepare(
    `INSERT INTO customers (name, email, phone, address_line1, address_line2, city, state, zip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       name = excluded.name, phone = excluded.phone,
       address_line1 = excluded.address_line1, address_line2 = excluded.address_line2,
       city = excluded.city, state = excluded.state, zip = excluded.zip`,
  )
    .bind(
      customer.name,
      customer.email,
      customer.phone ?? null,
      customer.address_line1,
      customer.address_line2 ?? null,
      customer.city,
      customer.state,
      customer.zip,
    )
    .run();

  const customerRow = await c.env.DB.prepare("SELECT id FROM customers WHERE email = ?")
    .bind(customer.email)
    .first<{ id: number }>();

  // Create a pending order
  const orderResult = await c.env.DB.prepare(
    `INSERT INTO orders (customer_id, csa_product_id, status, amount_cents)
     VALUES (?, ?, 'pending', ?)`,
  )
    .bind(customerRow!.id, productId, product.price_cents)
    .run();

  const orderId = orderResult.meta.last_row_id;

  // Create Stripe Checkout session — price is defined inline, no Stripe product needed
  const stripe = stripeClient(c.env.STRIPE_SECRET_KEY);
  const origin = new URL(c.req.url).origin;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: product.price_cents,
          product_data: {
            name: product.name,
            ...(product.description ? { description: product.description } : {}),
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?productId=${productId}&cancelled=1`,
    customer_email: customer.email,
    metadata: {
      orderId: String(orderId),
      productId: String(productId),
      customerId: String(customerRow!.id),
    },
  });

  await c.env.DB.prepare("UPDATE orders SET stripe_session_id = ? WHERE id = ?")
    .bind(session.id, orderId)
    .run();

  return c.json({ url: session.url });
});

// ─── Stripe webhook ───────────────────────────────────────────────────────────

app.post("/webhooks/stripe", async (c) => {
  const sig = c.req.header("stripe-signature");
  if (!sig) return c.json({ error: "Missing signature" }, 400);

  const body = await c.req.text();
  const stripe = stripeClient(c.env.STRIPE_SECRET_KEY);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, c.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return c.json({ error: "Invalid signature" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = Number(session.metadata?.orderId);
    const productId = Number(session.metadata?.productId);

    if (orderId) {
      await c.env.DB.prepare(
        `UPDATE orders SET status = 'paid', stripe_payment_intent_id = ? WHERE id = ?`,
      )
        .bind(session.payment_intent as string, orderId)
        .run();
    }

    if (productId) {
      await c.env.DB.prepare(
        `UPDATE csa_products
         SET spots_remaining = spots_remaining - 1, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND spots_remaining > 0`,
      )
        .bind(productId)
        .run();
    }
  }

  return c.json({ ok: true });
});

// ─── Legacy CSA waitlist (keep for backwards compat) ─────────────────────────

app.post("/csa-signup", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = csaSignupSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.flatten() }, 400);
  }
  const { name, email, phone, message } = parsed.data;
  await c.env.DB.prepare(
    "INSERT INTO csa_signups (name, email, phone, message) VALUES (?, ?, ?, ?)",
  )
    .bind(name, email, phone ?? null, message ?? null)
    .run();

  const signup = { name, email, phone, message };
  const jobs: Array<Promise<void>> = [];
  if (c.env.NOTIFY_EMAIL) {
    const { subject, html } = csaNotification(signup);
    jobs.push(sendEmail(c.env, { to: c.env.NOTIFY_EMAIL, subject, html, replyTo: email }));
  }
  const reply = csaAutoReply(signup);
  jobs.push(
    sendEmail(c.env, { to: email, subject: reply.subject, html: reply.html, replyTo: c.env.NOTIFY_EMAIL }),
  );
  deliverAfterResponse(c, jobs);
  return c.json({ success: true }, 201);
});

// ─── Contact ──────────────────────────────────────────────────────────────────

app.post("/contact", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.flatten() }, 400);
  }
  const { name, email, subject, message } = parsed.data;
  await c.env.DB.prepare(
    "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
  )
    .bind(name, email, subject ?? null, message)
    .run();

  const msg = { name, email, subject, message };
  const jobs: Array<Promise<void>> = [];
  if (c.env.NOTIFY_EMAIL) {
    const notif = contactNotification(msg);
    jobs.push(
      sendEmail(c.env, { to: c.env.NOTIFY_EMAIL, subject: notif.subject, html: notif.html, replyTo: email }),
    );
  }
  const reply = contactAutoReply(msg);
  jobs.push(
    sendEmail(c.env, { to: email, subject: reply.subject, html: reply.html, replyTo: c.env.NOTIFY_EMAIL }),
  );
  deliverAfterResponse(c, jobs);
  return c.json({ success: true }, 201);
});

export const onRequest = handle(app);
