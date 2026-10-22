import { expect, test } from "@playwright/test";

test.describe("idioma", () => {
  test("a raiz leva para /pt em um navegador em português", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/pt$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  });

  test.describe("navegador em inglês", () => {
    test.use({ locale: "en-US" });

    test("a raiz leva para /en", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/en$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
    });
  });

  test("o seletor troca o idioma e mantém a página", async ({ page }) => {
    // A 404 não depende da API do GitHub e tem caminho próprio para conferir
    await page.goto("/pt/caminho-qualquer");
    await page
      .getByRole("navigation", { name: "Idioma" })
      .getByRole("link", { name: "en" })
      .click();
    await expect(page).toHaveURL(/\/en\/caminho-qualquer$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Page not found",
    );
  });
});

test.describe("tema", () => {
  test("a escolha de tema continua depois de recarregar", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/pt");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: "Alternar tema" }).click();
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });
});

test.describe("página 404", () => {
  test("endereço que não existe mostra a página 404 com status 404", async ({
    page,
  }) => {
    const response = await page.goto("/pt/pagina-que-nao-existe");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "Página não encontrada" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Voltar ao início" }).last().click();
    await expect(page).toHaveURL(/\/pt$/);
  });

  test("a 404 também sai traduzida", async ({ page }) => {
    await page.goto("/en/this-page-does-not-exist");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Page not found",
    );
  });
});
