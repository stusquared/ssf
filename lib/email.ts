/**
 * Transactional email via Resend.
 *
 * Lives outside functions/ on purpose — every file under functions/ is mapped
 * to a route, and this is a shared module rather than an endpoint.
 *
 * Sending is best-effort: if the environment is not configured, or Resend
 * returns an error, we log and move on. A form submission is already durable
 * in D1 by the time we get here, so a mail failure must never fail the request.
 */

export interface EmailEnv {
  RESEND_API_KEY?: string;
  /** Where farm notifications land, e.g. "hello@sweetsourcefarmstead.com" */
  NOTIFY_EMAIL?: string;
  /** Verified sender, e.g. "Sweet Source Farmstead <hello@sweetsourcefarmstead.com>" */
  FROM_EMAIL?: string;
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

const BRAND = {
  ink: "#1a3558",
  sage: "#2d6fa0",
  terra: "#f5902a",
  parchment: "#faf7f2",
  muted: "#5a7a96",
  linen: "#e8f0f7",
};

/** Escape user-supplied text before it goes anywhere near an HTML body. */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendEmail(env: EmailEnv, args: SendArgs): Promise<void> {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) {
    console.warn(
      "[email] skipped — RESEND_API_KEY and/or FROM_EMAIL are not configured"
    );
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [args.to],
        subject: args.subject,
        html: args.html,
        ...(args.replyTo ? { reply_to: args.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "<no body>");
      console.error(`[email] Resend returned ${res.status}: ${detail}`);
    }
  } catch (err) {
    console.error("[email] send threw:", err);
  }
}

/** Shared shell so both templates look like they came from the same farm. */
function layout(heading: string, inner: string): string {
  return `
<div style="margin:0;padding:24px;background:${BRAND.parchment};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid ${BRAND.linen};">
    <tr>
      <td style="padding:28px 32px 0 32px;">
        <p style="margin:0 0 4px 0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.terra};font-weight:600;">Sweet Source Farmstead</p>
        <h1 style="margin:0 0 20px 0;font-size:22px;line-height:1.3;color:${BRAND.ink};font-weight:600;">${heading}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 28px 32px;color:${BRAND.ink};font-size:15px;line-height:1.6;">
        ${inner}
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px;background:${BRAND.linen};color:${BRAND.muted};font-size:12px;line-height:1.5;">
        Sweet Source Farmstead &middot; Willow Spring, North Carolina
      </td>
    </tr>
  </table>
</div>`.trim();
}

/** A label/value row for the notification emails. */
function row(label: string, value: string): string {
  return `
<tr>
  <td style="padding:6px 0;color:${BRAND.muted};font-size:13px;width:110px;vertical-align:top;">${esc(label)}</td>
  <td style="padding:6px 0;color:${BRAND.ink};font-size:14px;">${esc(value)}</td>
</tr>`;
}

export interface CsaSignup {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export function csaNotification(s: CsaSignup): { subject: string; html: string } {
  const rows = [
    row("Name", s.name),
    row("Email", s.email),
    s.phone ? row("Phone", s.phone) : "",
    s.message ? row("Notes", s.message) : "",
  ].join("");

  return {
    subject: `New CSA signup — ${s.name}`,
    html: layout(
      "New CSA signup",
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows}</table>
       <p style="margin:20px 0 0 0;font-size:13px;color:${BRAND.muted};">Reply to this email to reach them directly.</p>`
    ),
  };
}

export function csaAutoReply(s: CsaSignup): { subject: string; html: string } {
  return {
    subject: "We got your CSA signup — Sweet Source Farmstead",
    html: layout(
      `Thanks, ${esc(s.name.split(" ")[0] || s.name)}!`,
      `<p style="margin:0 0 14px 0;">We've received your request for a CSA share and we're glad you're interested in eating with us this season.</p>
       <p style="margin:0 0 14px 0;">One of us will be in touch shortly to confirm your spot for the coming month and arrange payment. Shares are $35 per week, and you'll get five to seven items each time.</p>
       <p style="margin:0 0 8px 0;font-weight:600;">Pickup at the farm</p>
       <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px 0;">
         <tr><td style="padding:2px 16px 2px 0;color:${BRAND.ink};font-size:14px;">Thursday</td><td style="padding:2px 0;color:${BRAND.muted};font-size:14px;">3:00 – 6:00 pm</td></tr>
         <tr><td style="padding:2px 16px 2px 0;color:${BRAND.ink};font-size:14px;">Friday</td><td style="padding:2px 0;color:${BRAND.muted};font-size:14px;">4:00 – 7:00 pm</td></tr>
         <tr><td style="padding:2px 16px 2px 0;color:${BRAND.ink};font-size:14px;">Saturday</td><td style="padding:2px 0;color:${BRAND.muted};font-size:14px;">9:00 am – 12:00 pm</td></tr>
       </table>
       <p style="margin:0;">If none of those windows work for you, just reply and we'll see what we can arrange.</p>`
    ),
  };
}

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export function contactNotification(m: ContactMessage): { subject: string; html: string } {
  const rows = [
    row("Name", m.name),
    row("Email", m.email),
    m.subject ? row("Subject", m.subject) : "",
  ].join("");

  return {
    subject: `Contact form — ${m.subject?.trim() || m.name}`,
    html: layout(
      "New message from the website",
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows}</table>
       <div style="margin:16px 0 0 0;padding:14px 16px;background:${BRAND.parchment};border-left:3px solid ${BRAND.terra};white-space:pre-wrap;font-size:14px;line-height:1.6;">${esc(m.message)}</div>
       <p style="margin:20px 0 0 0;font-size:13px;color:${BRAND.muted};">Reply to this email to reach them directly.</p>`
    ),
  };
}

export function contactAutoReply(m: ContactMessage): { subject: string; html: string } {
  return {
    subject: "We got your message — Sweet Source Farmstead",
    html: layout(
      `Thanks for writing, ${esc(m.name.split(" ")[0] || m.name)}!`,
      `<p style="margin:0 0 14px 0;">Your message has reached us and we'll get back to you as soon as we're in from the field.</p>
       <p style="margin:0;">In the meantime, you're welcome to come find us at the farm during open hours — Thursday 3–6, Friday 4–7, or Saturday 9–12.</p>`
    ),
  };
}
