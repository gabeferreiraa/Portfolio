import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { parseContact } from "../contact-schema";

export type ContactResult = { ok: true } | { ok: false; error: string };

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator(parseContact)
  .handler(async ({ data }): Promise<ContactResult> => {
    // Silently accept bot submissions so they don't retry
    if (data.company) return { ok: true };

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return { ok: false, error: "The contact form isn't configured yet. Please email me directly." };
    }

    const resend = new Resend(apiKey);
    const name = `${data.firstName} ${data.lastName}`;

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? "gferreira0404@gmail.com",
      replyTo: data.email,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${data.email}>\n\n${data.message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(data.email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
    });

    if (error) {
      console.error("Resend error", error);
      return { ok: false, error: "Something went wrong sending your message. Please try again or email me directly." };
    }

    return { ok: true };
  });
