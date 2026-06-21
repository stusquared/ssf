import { Hono } from "hono";
import { z } from "zod";

type Bindings = {
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
  return c.json({ success: true }, 201);
});

export const onRequest = app.fetch;
