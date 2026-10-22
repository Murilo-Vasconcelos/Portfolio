import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// O jsdom não tem matchMedia: simula uma media query que dá para ligar e
// desligar, para conferir que o hook acompanha a mudança
function mockMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((media: string) => ({
      media,
      get matches() {
        return matches;
      },
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    })),
  );
  return {
    listeners,
    set(value: boolean) {
      matches = value;
      listeners.forEach((fn) => fn());
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useMediaQuery", () => {
  it("devolve o estado atual da media query", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery("(hover: hover)"));
    expect(result.current).toBe(true);
  });

  it("atualiza quando a media query muda", () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(hover: hover)"));
    expect(result.current).toBe(false);

    act(() => media.set(true));
    expect(result.current).toBe(true);
  });

  it("para de ouvir quando o componente sai da tela", () => {
    const media = mockMatchMedia(false);
    const { unmount } = renderHook(() => useMediaQuery("(hover: hover)"));
    expect(media.listeners.size).toBe(1);

    unmount();
    expect(media.listeners.size).toBe(0);
  });
});
