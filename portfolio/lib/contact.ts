import { z } from "zod";

// Regras do formulário de contato. O mesmo esquema valida no navegador (para
// a mensagem aparecer na hora) e no servidor (que nunca confia no navegador).
// Os erros são códigos; o texto de cada um fica nos dicionários pt/en.
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "nameShort" })
    .max(100, { error: "nameLong" }),
  email: z
    .string()
    .trim()
    .min(1, { error: "emailRequired", abort: true })
    .pipe(
      z.email({ error: "emailInvalid" }).max(254, { error: "emailInvalid" }),
    ),
  message: z
    .string()
    .trim()
    .min(20, { error: "messageShort" })
    .max(2000, { error: "messageLong" }),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactErrorCode =
  | "nameShort"
  | "nameLong"
  | "emailRequired"
  | "emailInvalid"
  | "messageShort"
  | "messageLong";
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

export const MESSAGE_MAX = 2000;

type Result =
  | { success: true; data: ContactInput }
  | { success: false; errors: ContactErrors };

// Valida e devolve só o primeiro erro de cada campo
export function validateContact(values: Record<ContactField, string>): Result {
  const result = contactSchema.safeParse(values);
  if (result.success) return { success: true, data: result.data };

  const errors: ContactErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    errors[field] ??= issue.message as ContactErrorCode;
  }
  return { success: false, errors };
}
