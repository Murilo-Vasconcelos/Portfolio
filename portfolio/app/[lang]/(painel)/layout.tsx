// Moldura das páginas do painel (login e dashboard)
export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="conteudo"
      className="mx-auto min-h-svh max-w-6xl px-5 pt-32 pb-24 sm:px-8 sm:pt-40"
    >
      {children}
    </main>
  );
}
