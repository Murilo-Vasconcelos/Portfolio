// Faixa de palavras que corre sem parar. É só decoração (aria-hidden),
// porque tudo que aparece aqui também está escrito nas seções.
export default function Marquee({
  items,
  reverse = false,
  outline = false,
}: {
  items: readonly string[];
  reverse?: boolean;
  outline?: boolean;
}) {
  return (
    <div aria-hidden className="marquee overflow-hidden whitespace-nowrap">
      <div className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <li
                key={item}
                className={`flex items-center gap-8 pr-8 font-display text-5xl font-bold uppercase sm:text-7xl ${
                  outline ? "text-outline-thin" : ""
                }`}
              >
                {item}
                <span className="text-2xl text-muted sm:text-3xl">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
