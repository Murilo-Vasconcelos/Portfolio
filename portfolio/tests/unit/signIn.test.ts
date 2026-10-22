import { afterEach, describe, expect, it, vi } from "vitest";
import { signIn } from "@/actions/auth";

vi.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));

function form(email: string, password: string) {
  const data = new FormData();
  data.set("email", email);
  data.set("password", password);
  return data;
}

afterEach(() => vi.unstubAllEnvs());

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
});
