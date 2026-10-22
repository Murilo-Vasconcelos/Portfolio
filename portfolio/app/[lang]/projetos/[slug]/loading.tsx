// Esqueleto da página de um projeto, mostrado na hora para projetos que
// ainda não foram gerados no build, enquanto o conteúdo carrega.
export default function ProjectLoading() {
  return (
    <div aria-busy className="motion-safe:animate-pulse">
      <div className="h-4 w-36 rounded-full bg-line" />
      <div className="mt-10 h-3 w-24 rounded-full bg-line" />
      <div className="mt-4 h-16 w-3/4 rounded-2xl bg-line sm:h-24" />
      <div className="mt-8 h-5 w-full max-w-2xl rounded-full bg-line" />
      <div className="mt-3 h-5 w-2/3 max-w-xl rounded-full bg-line" />
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-20 rounded-2xl bg-line" />
        ))}
      </div>
    </div>
  );
}
