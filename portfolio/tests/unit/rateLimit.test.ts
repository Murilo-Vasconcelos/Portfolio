import { describe, expect, it } from "vitest";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";

describe("createRateLimiter", () => {
  it("deixa passar até o limite e barra depois", () => {
    const allow = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(allow("1.1.1.1", 0)).toBe(true);
    expect(allow("1.1.1.1", 10)).toBe(true);
    expect(allow("1.1.1.1", 20)).toBe(false);
  });

  it("libera de novo quando a janela acaba", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow("1.1.1.1", 0)).toBe(true);
    expect(allow("1.1.1.1", 999)).toBe(false);
    expect(allow("1.1.1.1", 1000)).toBe(true);
  });

  it("conta cada IP separado", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow("1.1.1.1", 0)).toBe(true);
    expect(allow("2.2.2.2", 0)).toBe(true);
    expect(allow("1.1.1.1", 0)).toBe(false);
  });
});

describe("clientIp", () => {
  it("usa o primeiro endereço do x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "8.8.8.8, 10.0.0.1" });
    expect(clientIp(headers)).toBe("8.8.8.8");
  });

  it("cai no x-real-ip e, sem nenhum, num valor fixo", () => {
    expect(clientIp(new Headers({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(clientIp(new Headers())).toBe("desconhecido");
  });
});
