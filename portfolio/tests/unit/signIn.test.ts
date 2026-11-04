import { afterEach, describe, expect, it, vi } from "vitest";
import { signIn } from "@/actions/auth";

const mocks = vi.hoisted(() => ({
  ip: "1.1.1.1",
  signInWithPassword: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
  headers: async () => new Headers({ "x-forwarded-for": mocks.ip }),
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabase: async () => ({
    auth: { signInWithPassword: mocks.signInWithPassword },
  }),
}));

function form(email: string, password: string) {
  const data = new FormData();
  data.set("email", email);
  data.set("password", password);
  return data;
}

function configureSupabase() {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemplo.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "chave-publica");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("login do painel", () => {
  it("aponta e-mail inválido e senha vazia", async () => {
    expect(await signIn("pt", { status: "idle" }, form("ana", ""))).toEqual({
      status: "invalid",
      errors: { email: "emailInvalid", password: "passwordRequired" },
    });
  });

  it("avisa que está indisponível quando o Supabase não está configurado", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    expect(
      await signIn("pt", { status: "idle" }, form("ana@exemplo.com", "123456")),
    ).toEqual({ status: "unavailable" });
  });

  it("nunca redireciona para fora do site, mesmo com idioma forjado", async () => {
    configureSupabase();
    mocks.ip = "3.3.3.3";
    mocks.signInWithPassword.mockResolvedValue({ error: null });
    await signIn("/evil.com", { status: "idle" }, form("ana@exemplo.com", "1"));
    expect(mocks.redirect).toHaveBeenCalledWith("/pt/dashboard");
  });

  it("barra o IP depois de 10 tentativas seguidas", async () => {
    configureSupabase();
    mocks.ip = "4.4.4.4";
    mocks.signInWithPassword.mockResolvedValue({ error: { status: 400 } });
    for (let i = 0; i < 10; i++) {
      expect(
        await signIn("pt", { status: "idle" }, form("ana@exemplo.com", "x")),
      ).toEqual({ status: "wrong" });
    }
    expect(
      await signIn("pt", { status: "idle" }, form("ana@exemplo.com", "x")),
    ).toEqual({ status: "tooMany" });
    expect(mocks.signInWithPassword).toHaveBeenCalledTimes(10);
  });
});
