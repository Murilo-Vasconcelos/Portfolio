import Spinner from "@/components/Spinner";

type Variant = "primary" | "secondary" | "outline";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  // Cheio: a ação principal da tela
  primary:
    "border-fg bg-fg text-bg hover:bg-transparent hover:text-fg disabled:hover:bg-fg disabled:hover:text-bg",
  // Borda fina: ações de apoio
  secondary: "border-line hover:border-fg",
  // Borda forte que se preenche no hover
  outline: "border-fg hover:bg-fg hover:text-bg",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3",
  lg: "px-7 py-3.5",
};

// Classes do botão do site. Usadas pelo <Button> e por links que precisam
// parecer botão (<a>, <Link>), para que todos fiquem iguais em todas as páginas.
export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return `inline-flex items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`;
}

type Props = React.ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  // Enquanto true, o botão fica bloqueado e mostra o spinner com `pendingLabel`
  pending?: boolean;
  pendingLabel?: string;
};

export default function Button({
  variant,
  size,
  pending = false,
  pendingLabel,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {pending && <Spinner />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
