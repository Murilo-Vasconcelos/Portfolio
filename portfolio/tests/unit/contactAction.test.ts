import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendContactMessage } from "@/actions/contact";

const mocks = vi.hoisted(() => ({
  ip: "1.1.1.1",
  saveMessage: vi.fn(),
  after: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": mocks.ip }),
}));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/services/messages", () => ({ saveMessage: mocks.saveMessage }));
vi.mock("@/services/email", () => ({ sendContactEmail: vi.fn() }));

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = {
  name: "Ana",
  email: "ana@exemplo.com",
  message: "Olá! Gostei muito do seu portfólio.",
};

beforeEach(() => vi.clearAllMocks());

describe("envio do formulário de contato", () => {
  it("grava a mensagem válida e agenda o e-mail", async () => {
    mocks.ip = "5.5.5.5";
    expect(await sendContactMessage({ status: "idle" }, form(valid))).toEqual({
      status: "success",
    });
    expect(mocks.saveMessage).toHaveBeenCalledWith(valid);
    expect(mocks.after).toHaveBeenCalled();
  });

  it("finge sucesso para robô e não grava nada", async () => {
    const bot = form({ ...valid, website: "http://spam.example" });
    expect(await sendContactMessage({ status: "idle" }, bot)).toEqual({
      status: "success",
    });
    expect(mocks.saveMessage).not.toHaveBeenCalled();
  });

  it("barra o IP depois de 5 mensagens seguidas", async () => {
    mocks.ip = "6.6.6.6";
    for (let i = 0; i < 5; i++) {
      await sendContactMessage({ status: "idle" }, form(valid));
    }
    expect(await sendContactMessage({ status: "idle" }, form(valid))).toEqual({
      status: "tooMany",
    });
    expect(mocks.saveMessage).toHaveBeenCalledTimes(5);
  });
});
