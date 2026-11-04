// Limite de tentativas por chave (o IP de quem envia), guardado na memória do
// servidor. Não é perfeito: cada instância da Vercel tem a própria memória, que
// some quando ela é reciclada. Mas barra o abuso mais comum (alguém repetindo
// o envio ou chutando senhas em sequência) sem depender de outro serviço.

type Window = { count: number; resetAt: number };

// Acima disso a memória é limpa, para um ataque com muitos IPs não crescer o
// mapa sem fim
const MAX_KEYS = 5000;

export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) {
  const hits = new Map<string, Window>();

  return function allow(key: string, now = Date.now()): boolean {
    const current = hits.get(key);
    if (current && current.resetAt > now) {
      if (current.count >= limit) return false;
      current.count += 1;
      return true;
    }

    if (hits.size >= MAX_KEYS) {
      for (const [k, w] of hits) if (w.resetAt <= now) hits.delete(k);
      if (hits.size >= MAX_KEYS) hits.clear();
    }
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  };
}

// IP de quem fez a requisição. Na Vercel o primeiro endereço do
// x-forwarded-for é o do visitante (a própria Vercel sobrescreve o cabeçalho).
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "desconhecido";
}
