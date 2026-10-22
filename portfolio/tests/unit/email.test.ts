import { afterEach, describe, expect, it, vi } from "vitest";
import { sendContactEmail } from "@/services/email";

const input = {
  name: "Ana Souza",
  email: "ana@exemplo.com",
  message: "Quero conversar sobre uma vaga de estágio.",
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("sendContactEmail", () => {
  it("não chama o Resend sem a chave da API", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(await sendContactEmail(input)).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("manda o e-mail para o dono, com resposta direto para o visitante", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_123");
    vi.stubEnv("CONTACT_TO_EMAIL", "dono@exemplo.com");
    const fetchMock = vi.fn(() =>
      Promise.resolve(new Response("{}", { status: 200 })),
    );
    vi.stubGlobal("fetch", fetchMock);

    expect(await sendContactEmail(input)).toBe(true);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers).toMatchObject({ Authorization: "Bearer re_123" });
    expect(JSON.parse(String(init.body))).toMatchObject({
      to: ["dono@exemplo.com"],
      reply_to: "ana@exemplo.com",
      subject: "Nova mensagem de Ana Souza pelo portfólio",
    });
  });

  it("devolve false quando o Resend falha ou a rede cai", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_123");
    vi.stubGlobal("fetch", () =>
      Promise.resolve(new Response("{}", { status: 500 })),
    );
    expect(await sendContactEmail(input)).toBe(false);

    vi.stubGlobal("fetch", () => Promise.reject(new TypeError("offline")));
    expect(await sendContactEmail(input)).toBe(false);
  });
});
