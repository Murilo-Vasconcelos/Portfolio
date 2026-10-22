"use server";

import { after } from "next/server";
import { validateContact, type ContactErrors } from "@/lib/contact";
import { sendContactEmail } from "@/services/email";
import { saveMessage } from "@/services/messages";

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors }
  | { status: "success" }
  | { status: "error" };

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
