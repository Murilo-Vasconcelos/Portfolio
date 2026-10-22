import { expect, test } from "@playwright/test";

// Só a validação: um envio de verdade gravaria no banco de produção
test.describe("formulário de contato", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pt#contato");
  });

  test("mostra a mensagem de cada campo ao enviar vazio", async ({ page }) => {
    const form = page.locator("form", {
      has: page.getByRole("button", { name: "Enviar mensagem" }),
    });
    await form.getByRole("button", { name: "Enviar mensagem" }).click();

    await expect(
      form.getByText("Informe seu nome, com pelo menos 2 letras."),
    ).toBeVisible();
    await expect(
      form.getByText("Informe seu e-mail para eu poder responder."),
    ).toBeVisible();
    await expect(
      form.getByText("A mensagem precisa ter no mínimo 20 caracteres."),
    ).toBeVisible();
    await expect(form.getByLabel("Nome")).toBeFocused();
  });

  test("avisa de e-mail inválido e mensagem curta ao sair do campo", async ({
    page,
  }) => {
    const email = page.getByLabel("E-mail", { exact: true });
    await email.fill("ana@exemplo");
    await email.blur();
    await expect(
      page.getByText(
        "E-mail inválido. Confira se está no formato nome@dominio.com.",
      ),
    ).toBeVisible();
    await expect(email).toHaveAttribute("aria-invalid", "true");

    const message = page.getByLabel("Mensagem");
    await message.fill("Oi!");
    await message.blur();
    await expect(
      page.getByText("A mensagem precisa ter no mínimo 20 caracteres."),
    ).toBeVisible();

    // Corrigindo, o erro some na hora
    await email.fill("ana@exemplo.com");
    await expect(email).toHaveAttribute("aria-invalid", "false");
  });

  test.describe("em inglês", () => {
    test("as mensagens de erro também saem traduzidas", async ({ page }) => {
      await page.goto("/en#contato");
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(
        page.getByText("Enter your email so I can reply."),
      ).toBeVisible();
    });
  });
});
