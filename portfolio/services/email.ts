import { profile } from "@/data/profile";
import type { ContactInput } from "@/lib/contact";

// Avisa o dono do site por e-mail usando a API REST do Resend (sem SDK: é uma
// única chamada). Sem RESEND_API_KEY o envio é pulado; a mensagem continua
// salva no banco e aparece no painel.
export async function sendContactEmail(input: ContactInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const to = process.env.CONTACT_TO_EMAIL || profile.links.email;
  const from =
    process.env.CONTACT_FROM_EMAIL || "Portfólio <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      // "Responder" no e-mail já vai direto para quem escreveu
      reply_to: input.email,
      subject: `Nova mensagem de ${input.name} pelo portfólio`,
      text: `${input.message}\n\n— ${input.name} <${input.email}>`,
    }),
  }).catch(() => null);

  return response?.ok ?? false;
}
