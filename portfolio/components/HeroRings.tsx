// Círculos finos de fundo, como no design de referência. Só decoração.
export default function HeroRings() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 800 800"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="ring-spin absolute -top-48 -right-48 h-[620px] w-[620px] text-fg opacity-[0.14] sm:h-[860px] sm:w-[860px]"
      >
        <circle cx="400" cy="400" r="390" />
        <circle cx="400" cy="400" r="300" strokeDasharray="4 10" />
        <circle cx="400" cy="400" r="210" />
      </svg>

      <svg
        viewBox="0 0 800 800"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="ring-spin-reverse absolute -bottom-72 -left-56 h-[560px] w-[560px] text-fg opacity-[0.12] sm:h-[760px] sm:w-[760px]"
      >
        <circle cx="400" cy="400" r="390" />
        <circle cx="400" cy="400" r="260" strokeDasharray="2 12" />
      </svg>
    </div>
  );
}
