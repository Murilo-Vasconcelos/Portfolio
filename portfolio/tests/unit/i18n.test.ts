import { describe, expect, it } from "vitest";
import { formatDate } from "@/lib/format";
import { hasLocale } from "@/lib/i18n";

describe("hasLocale", () => {
  it("aceita só os idiomas do site", () => {
    expect(hasLocale("pt")).toBe(true);
    expect(hasLocale("en")).toBe(true);
    expect(hasLocale("es")).toBe(false);
    expect(hasLocale("PT")).toBe(false);
    expect(hasLocale("")).toBe(false);
  });
});

describe("formatDate", () => {
  // Fim do dia em UTC: garante que o fuso da máquina não muda a data
  const date = "2026-10-22T23:30:00Z";

  it("formata no padrão brasileiro em /pt", () => {
    expect(formatDate(date, "pt")).toBe("22 de out. de 2026");
  });

  it("formata no padrão americano em /en", () => {
    expect(formatDate(date, "en")).toBe("Oct 22, 2026");
  });
});
