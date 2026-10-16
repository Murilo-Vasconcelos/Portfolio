"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribe = () => () => {};

type Labels = {
  toLight: string;
  toDark: string;
  aria: string;
};

export default function ThemeToggle({ labels }: { labels: Labels }) {
  const { resolvedTheme, setTheme } = useTheme();

  // false no servidor, true no navegador: evita diferença entre os dois
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) return <div className="h-9 w-24 sm:w-28" />;

  const isDark = resolvedTheme === "dark";

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Navegadores sem View Transitions (ou com "reduzir movimento"):
    // troca direto, sem efeito.
    if (reduceMotion || !document.startViewTransition) {
      setTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const root = document.documentElement;
    const transition = document.startViewTransition(() => {
      // Muda a classe na hora para o navegador tirar a "foto" do tema novo
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      setTheme(next);
    });

    transition.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <button
      onClick={toggle}
      aria-label={labels.aria}
      className="whitespace-nowrap rounded-full border border-line px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm transition-colors hover:bg-fg hover:text-bg"
    >
      {/* Em telas muito estreitas (< 360px) o botão vira só um ícone */}
      <span className="max-[359px]:hidden">
        {isDark ? labels.toLight : labels.toDark}
      </span>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="hidden h-4 w-4 max-[359px]:block"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
      </svg>
    </button>
  );
}
