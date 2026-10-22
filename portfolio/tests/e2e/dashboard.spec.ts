import { expect, test } from "@playwright/test";

test.describe("bloqueio do dashboard sem login", () => {
  test("quem não está logado é levado do dashboard para o login", async ({
    page,
  }) => {
    await page.goto("/pt/dashboard");

    await expect(page).toHaveURL(/\/pt\/login$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Entrar" }),
    ).toBeVisible();
    // Nada do painel aparece, nem por um instante no HTML
    await expect(page.getByRole("heading", { name: "Mensagens" })).toHaveCount(
      0,
    );
    await expect(page.getByRole("button", { name: "Sair" })).toHaveCount(0);
  });

  test("o bloqueio vale para subpáginas e para o inglês", async ({ page }) => {
    await page.goto("/en/dashboard/qualquer-coisa");
    await expect(page).toHaveURL(/\/en\/login$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Sign in" }),
    ).toBeVisible();
  });

  test("o redirecionamento acontece no servidor, antes da página", async ({
    request,
  }) => {
    const response = await request.get("/pt/dashboard", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toMatch(/\/pt\/login$/);
  });
});

test.describe("tela de login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pt/login");
  });

  test("valida os campos antes de tentar entrar", async ({ page }) => {
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Informe um e-mail válido.")).toBeVisible();
    await expect(page.getByText("Informe a senha.")).toBeVisible();
    await expect(page).toHaveURL(/\/pt\/login$/);
  });

  test("senha errada não entra no painel", async ({ page }) => {
    await page.getByLabel("E-mail").fill("alguem@exemplo.com");
    await page.getByLabel("Senha").fill("senha-errada-123");
    await page.getByRole("button", { name: "Entrar" }).click();

    // Sem Supabase configurado (como no CI) o aviso é de indisponível
    await expect(
      page.getByRole("alert").filter({
        hasText: /E-mail ou senha incorretos\.|O login está indisponível agora/,
      }),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/pt\/login$/);
  });

  test("a página de login não entra nos buscadores", async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
});

// Fluxo completo com um usuário de teste. Só roda quando o Supabase e as
// credenciais estão nas variáveis de ambiente (E2E_OWNER_EMAIL e
// E2E_OWNER_PASSWORD); no CI sem segredos ele é pulado.
test.describe("dono logado", () => {
  const email = process.env.E2E_OWNER_EMAIL;
  const password = process.env.E2E_OWNER_PASSWORD;
  test.skip(!email || !password, "sem usuário de teste configurado");

  test("entra, vê o painel e sai", async ({ page }) => {
    await page.goto("/pt/login");
    await page.getByLabel("E-mail").fill(email ?? "");
    await page.getByLabel("Senha").fill(password ?? "");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/pt\/dashboard$/);
    await expect(
      page.getByRole("heading", { level: 2, name: "Mensagens" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Projetos em destaque" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page).toHaveURL(/\/pt\/login$/);
  });
});
