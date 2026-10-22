import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveFeatured, toggleAnswered } from "@/actions/dashboard";

const mocks = vi.hoisted(() => ({
  auth: null as null | { user: { id: string }; supabase: object },
  setMessageAnswered: vi.fn(),
  saveFeaturedSlugs: vi.fn(),
  updateTag: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/cache", () => ({
  updateTag: mocks.updateTag,
  refresh: mocks.refresh,
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock("@/services/auth", () => ({
  getAuthenticatedClient: async () => mocks.auth,
}));
vi.mock("@/services/messages", () => ({
  setMessageAnswered: mocks.setMessageAnswered,
}));
vi.mock("@/services/featured", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/services/featured")>()),
  saveFeaturedSlugs: mocks.saveFeaturedSlugs,
}));

const id = "6f1c2a52-3d1b-4c55-9b7e-2b0f1f9c8a11";

function form(slugs: string[]) {
  const data = new FormData();
  for (const slug of slugs) data.append("slug", slug);
  return data;
}

beforeEach(() => {
  mocks.auth = null;
  vi.clearAllMocks();
});

describe("ações do painel sem login", () => {
  it("não marcam mensagem como respondida", async () => {
    expect(await toggleAnswered(id, true)).toEqual({ ok: false });
    expect(mocks.setMessageAnswered).not.toHaveBeenCalled();
  });

  it("não salvam destaques", async () => {
    expect(await saveFeatured({ status: "idle" }, form(["portfolio"]))).toEqual(
      { status: "error" },
    );
    expect(mocks.saveFeaturedSlugs).not.toHaveBeenCalled();
  });
});

describe("ações do painel com login", () => {
  beforeEach(() => {
    mocks.auth = { user: { id: "dono" }, supabase: {} };
  });

  it("marcam como respondida e atualizam a tela", async () => {
    expect(await toggleAnswered(id, true)).toEqual({ ok: true });
    expect(mocks.setMessageAnswered).toHaveBeenCalledWith({}, id, true);
    expect(mocks.refresh).toHaveBeenCalled();
  });

  it("recusam um id que não é UUID", async () => {
    expect(await toggleAnswered("1 or 1=1", true)).toEqual({ ok: false });
    expect(mocks.setMessageAnswered).not.toHaveBeenCalled();
  });

  it("salvam os destaques na ordem escolhida e limpam o cache da home", async () => {
    const result = await saveFeatured(
      { status: "idle" },
      form(["revi", "portfolio"]),
    );
    expect(result).toEqual({ status: "saved" });
    expect(mocks.saveFeaturedSlugs).toHaveBeenCalledWith({}, [
      "revi",
      "portfolio",
    ]);
    expect(mocks.updateTag).toHaveBeenCalledWith("featured-repos");
  });

  it("recusam mais de 4 destaques", async () => {
    const result = await saveFeatured(
      { status: "idle" },
      form(["a", "b", "c", "d", "e"]),
    );
    expect(result).toEqual({ status: "tooMany" });
    expect(mocks.saveFeaturedSlugs).not.toHaveBeenCalled();
  });

  it("avisam do erro quando o banco falha", async () => {
    mocks.saveFeaturedSlugs.mockRejectedValueOnce(new Error("offline"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await saveFeatured({ status: "idle" }, form(["revi"]))).toEqual({
      status: "error",
    });
    expect(mocks.updateTag).not.toHaveBeenCalled();
  });
});
