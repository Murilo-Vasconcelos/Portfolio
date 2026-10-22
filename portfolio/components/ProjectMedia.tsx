import Image, { getImageProps } from "next/image";

// Imagem do projeto: aparece inteira (sem cortar), na proporção original,
// dentro de uma moldura com borda fina.
export default function ProjectMedia({
  image,
  alt,
  video,
  webm,
}: {
  image: { src: string; width: number; height: number };
  alt: string;
  video?: string;
  webm?: boolean;
}) {
  const sizes = "(min-width: 1024px) 520px, (min-width: 768px) 45vw, 90vw";
  // A capa do vídeo não passa pelo <Image>; getImageProps gera a mesma URL
  // otimizada (WebP no tamanho de exibição) para usar no poster.
  const poster = getImageProps({
    src: image.src,
    alt,
    width: 640,
    height: Math.round((640 * image.height) / image.width),
  }).props.src;

  return (
    <div
      data-no-tilt={video ? "" : undefined}
      className="relative z-10 overflow-hidden rounded-2xl border border-line bg-[#282a36]"
    >
      {video ? (
        // Vídeo só baixa quando a pessoa clica em play (preload="none"); o
        // print serve de capa. Sem áudio, então não precisa de legenda.
        <video
          controls
          playsInline
          preload="none"
          poster={poster}
          aria-label={alt}
          width={image.width}
          height={image.height}
          className="h-auto w-full"
        >
          <source src={video} type="video/mp4" />
          {webm && (
            <source src={video.replace(".mp4", ".webm")} type="video/webm" />
          )}
        </video>
      ) : (
        <Image
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          className="h-auto w-full"
        />
      )}
    </div>
  );
}
