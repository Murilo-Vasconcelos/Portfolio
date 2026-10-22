import { describe, expect, it } from "vitest";
import { validateContact } from "@/lib/contact";

const valid = {
  name: "Ana Souza",
  email: "ana@exemplo.com",
  message: "Oi, Murilo! Vi seu portfólio e quero conversar sobre uma vaga.",
};

describe("validação do formulário de contato", () => {
  it("aceita um formulário bem preenchido e tira os espaços das pontas", () => {
    const result = validateContact({ ...valid, name: "  Ana Souza  " });
    expect(result).toEqual({
      success: true,
      data: { ...valid, name: "Ana Souza" },
    });
  });

  it("aponta um erro específico para cada campo", () => {
    expect(validateContact({ name: "", email: "", message: "" })).toEqual({
      success: false,
      errors: {
        name: "nameShort",
        email: "emailRequired",
        message: "messageShort",
      },
    });
  });

  it.each([
    ["ana", "emailInvalid"],
    ["ana@", "emailInvalid"],
    ["ana@exemplo", "emailInvalid"],
    ["ana exemplo@site.com", "emailInvalid"],
  ])("recusa o e-mail %s", (email, code) => {
    const result = validateContact({ ...valid, email });
    expect(result).toEqual({ success: false, errors: { email: code } });
  });

  it("exige mensagem com no mínimo 20 caracteres, sem contar espaços", () => {
    const short = validateContact({
      ...valid,
      message: "  Oi, tudo bem?     ",
    });
    expect(short).toEqual({
      success: false,
      errors: { message: "messageShort" },
    });
    expect(validateContact({ ...valid, message: "x".repeat(20) }).success).toBe(
      true,
    );
  });

  it("recusa textos longos demais", () => {
    expect(validateContact({ ...valid, name: "a".repeat(101) })).toEqual({
      success: false,
      errors: { name: "nameLong" },
    });
    expect(validateContact({ ...valid, message: "a".repeat(2001) })).toEqual({
      success: false,
      errors: { message: "messageLong" },
    });
  });
});
