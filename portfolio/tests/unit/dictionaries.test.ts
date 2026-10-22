import { describe, expect, it } from "vitest";
import en from "@/app/[lang]/dictionaries/en.json";
import pt from "@/app/[lang]/dictionaries/pt.json";

// Lista todas as chaves do objeto, com o caminho completo ("hero.title")
function keys(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => keys(item, `${prefix}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      keys(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

describe("dicionários", () => {
  // O TypeScript só confere o inglês contra o português; aqui vale para os dois
  it("pt.json e en.json têm exatamente as mesmas chaves", () => {
    expect(keys(en).sort()).toEqual(keys(pt).sort());
  });

  it("nenhum texto ficou vazio", () => {
    const empty = (dict: unknown) =>
      keys(dict).filter((path) => {
        const value = path
          .split(/\.|\[(\d+)\]/)
          .filter(Boolean)
          .reduce<unknown>(
            (node, key) => (node as Record<string, unknown>)[key],
            dict,
          );
        return value === "";
      });
    expect(empty(pt)).toEqual([]);
    expect(empty(en)).toEqual([]);
  });
});
