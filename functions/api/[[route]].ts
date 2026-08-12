import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { z } from "zod";
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
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

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

app.get("/health", (c) => c.json({ ok: true }));

/**
 * Hand mail off to the runtime so it sends after the response goes out. The
 * submission is already saved by this point, so a mail failure is logged and
 * swallowed rather than surfaced to the visitor as a failed submission.
 */
function deliverAfterResponse(
  c: { env: Bindings; executionCtx?: ExecutionContext },
  jobs: Array<Promise<void>>
): void {
  const work = Promise.all(jobs).then(
    () => undefined,
    (err) => console.error("[email] delivery failed:", err)
  );
  try {
    c.executionCtx?.waitUntil(work);
  } catch {
    // No execution context (some local/test runners) — nothing more to do;
    // the promise still runs, it just is not kept alive past the response.
  }
}

app.post("/csa-signup", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = csaSignupSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.flatten() }, 400);
  }
  const { name, email, phone, message } = parsed.data;
  await c.env.DB.prepare(
    "INSERT INTO csa_signups (name, email, phone, message) VALUES (?, ?, ?, ?)"
  )
    .bind(name, email, phone ?? null, message ?? null)
    .run();

  const signup = { name, email, phone, message };
  const jobs: Array<Promise<void>> = [];
  if (c.env.NOTIFY_EMAIL) {
    const { subject, html } = csaNotification(signup);
    jobs.push(
      sendEmail(c.env, { to: c.env.NOTIFY_EMAIL, subject, html, replyTo: email })
    );
  }
  const reply = csaAutoReply(signup);
  jobs.push(sendEmail(c.env, { to: email, subject: reply.subject, html: reply.html }));
  deliverAfterResponse(c, jobs);

  return c.json({ success: true }, 201);
});

app.post("/contact", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.flatten() }, 400);
  }
  const { name, email, subject, message } = parsed.data;
  await c.env.DB.prepare(
    "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)"
  )
    .bind(name, email, subject ?? null, message)
    .run();

  const msg = { name, email, subject, message };
  const jobs: Array<Promise<void>> = [];
  if (c.env.NOTIFY_EMAIL) {
    const notif = contactNotification(msg);
    jobs.push(
      sendEmail(c.env, {
        to: c.env.NOTIFY_EMAIL,
        subject: notif.subject,
        html: notif.html,
        replyTo: email,
      })
    );
  }
  const reply = contactAutoReply(msg);
  jobs.push(sendEmail(c.env, { to: email, subject: reply.subject, html: reply.html }));
  deliverAfterResponse(c, jobs);

  return c.json({ success: true }, 201);
});

export const onRequest = handle(app);
