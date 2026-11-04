"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { validateContact, type ContactErrors } from "@/lib/contact";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import { sendContactEmail } from "@/services/email";
import { saveMessage } from "@/services/messages";

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors }
  | { status: "success" }
  | { status: "tooMany" }
  | { status: "error" };

// Até 5 mensagens a cada 10 minutos por IP: ninguém de verdade manda mais que
// isso, e um robô não lota o banco nem a cota de e-mails do Resend
const allowMessage = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

// Recebe o formulário de contato: valida de novo no servidor, grava no banco e
// manda o e-mail depois de responder (after), para o visitante não esperar.
export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Campo escondido que só robôs preenchem: finge sucesso e descarta
  if (formData.get("website")) return { status: "success" };

  const text = (field: string) => String(formData.get(field) ?? "");
  const result = validateContact({
    name: text("name"),
    email: text("email"),
    message: text("message"),
  });
  if (!result.success) return { status: "invalid", errors: result.errors };
  if (!allowMessage(clientIp(await headers()))) return { status: "tooMany" };

  try {
    await saveMessage(result.data);
  } catch (error) {
    console.error(error);
    return { status: "error" };
  }

  after(async () => {
    const sent = await sendContactEmail(result.data);
    if (!sent) console.warn("Mensagem salva, mas o e-mail não foi enviado");
  });

  return { status: "success" };
}
