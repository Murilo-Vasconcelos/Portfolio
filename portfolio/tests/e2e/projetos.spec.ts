import { expect, test, type Page } from "@playwright/test";

// A lista vem da API do GitHub. Se a API falhar (limite de requisições, por
// exemplo), o certo é aparecer a tela de erro com "Tentar de novo".
const apiError = (page: Page) =>
  page.getByRole("heading", { name: "O GitHub não respondeu" });

test("a lista de projetos mostra os repositórios ou a tela de erro", async ({
  page,
}) => {
  await page.goto("/pt/projetos");
  const cards = page.locator('main a[href^="/pt/projetos/"]');
  const error = apiError(page);
  await expect(cards.first().or(error)).toBeVisible();

  if (await error.isVisible()) {
    await expect(
      page.getByRole("button", { name: "Tentar de novo" }),
    ).toBeEnabled();
  } else {
    await expect(
      page.getByRole("heading", { level: 1, name: "Projetos" }),
    ).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  }
});

test("o card abre a página de detalhe do projeto", async ({ page }) => {
  await page.goto("/pt/projetos");
  const card = page.locator('main a[href^="/pt/projetos/"]').first();
  const error = apiError(page);
  await expect(card.or(error)).toBeVisible();
  test.skip(await error.isVisible(), "API do GitHub indisponível agora");

  const href = await card.getAttribute("href");
  await card.click();

  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Ver no GitHub/ }),
  ).toHaveAttribute("href", /^https:\/\/github\.com\//);

  await page.getByRole("link", { name: "← Todos os projetos" }).click();
  await expect(page).toHaveURL(/\/pt\/projetos$/);
});

test("projeto que não existe mostra a página 404", async ({ page }) => {
  await page.goto("/pt/projetos/repositorio-que-nao-existe");
  const error = apiError(page);
  const notFound = page.getByRole("heading", {
    level: 1,
    name: "Página não encontrada",
  });
  await expect(notFound.or(error)).toBeVisible();
  test.skip(await error.isVisible(), "API do GitHub indisponível agora");

  // A página já começou a ser enviada (esqueleto do loading.tsx) quando a API
  // responde, então o status HTTP fica 200; o que importa é o conteúdo e o
  // título da 404.
  await expect(page).toHaveTitle("Página não encontrada | Murilo Gomes");
});
