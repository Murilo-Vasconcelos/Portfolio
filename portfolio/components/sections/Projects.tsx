import Image from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import Reveal from "@/components/Reveal";
import SectionShell from "@/components/SectionShell";
import TiltCard from "@/components/TiltCard";
import { projects, reviTeam } from "@/data/projects";

type Dict = Dictionary["projects"];
type Project = (typeof projects)[number];

function TechChips({ tech }: { tech: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tech.map((item) => (
        <li
          key={item}
          className="rounded-full border border-line px-3 py-1 text-xs font-semibold"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="font-display text-xs uppercase tracking-[0.25em] text-muted">
        {label}
      </p>
      <p className="mt-1.5 leading-7">{text}</p>
    </div>
  );
}

// Imagem do projeto: aparece inteira (sem cortar), na proporção original,
// dentro de uma moldura com borda fina.
function ProjectImage({
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
          poster={image.src}
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
          sizes="(min-width: 1024px) 520px, (min-width: 768px) 45vw, 90vw"
          unoptimized
          className="h-auto w-full"
        />
      )}
    </div>
  );
}

// Link que cobre o card inteiro (o clique funciona em qualquer parte dele)
function CodeLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold after:absolute after:inset-0 after:rounded-3xl after:content-['']"
    >
      <span className="underline decoration-line decoration-2 underline-offset-4">
        {label}
      </span>
      ↗
    </a>
  );
}

function FeaturedProject({ project, dict }: { project: Project; dict: Dict }) {
  const text = dict.items[project.id];

  return (
    <Reveal>
      <TiltCard
        maxTilt={2.5}
        label={project.repo ? dict.codeLabel : undefined}
        className="rounded-3xl border border-fg bg-surface p-7 sm:p-10"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-fg px-3 py-1 font-display text-xs uppercase tracking-[0.25em] text-bg">
                {dict.featuredLabel}
              </span>
              <span className="font-display text-sm uppercase tracking-[0.2em] text-muted">
                {text.tag}
              </span>
            </div>

            <h3 className="font-display text-5xl font-bold uppercase leading-none [overflow-wrap:anywhere] sm:text-8xl">
              {text.name}
            </h3>
            <p className="font-semibold">{text.status}</p>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              {text.summary}
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Detail label={dict.partLabel} text={text.part} />
              <Detail label={dict.learnedLabel} text={text.learned} />
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:border-l lg:border-line lg:pl-10">
            {"image" in project && "imageAlt" in text && (
              <ProjectImage
                image={project.image}
                alt={text.imageAlt}
                video={"video" in project ? project.video : undefined}
                webm={"videoWebm" in project}
              />
            )}
            <div>
              <p className="font-display text-xs uppercase tracking-[0.25em] text-muted">
                {dict.teamLabel}
              </p>
              <ul className="mt-3 space-y-2">
                {reviTeam.map((member) => (
                  <li key={member.name}>
                    {member.url ? (
                      <a
                        href={member.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${dict.teamAria} ${member.name}`}
                        className="relative z-10 inline-flex items-center gap-2 font-semibold underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-fg"
                      >
                        {member.name} <span aria-hidden>↗</span>
                      </a>
                    ) : (
                      <span className="font-semibold">
                        {member.name}{" "}
                        <span className="font-normal text-muted">
                          ({dict.meLabel})
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <TechChips tech={project.tech} />

            {project.repo ? (
              <CodeLink href={project.repo} label={dict.codeLabel} />
            ) : (
              <p className="mt-auto inline-flex w-fit rounded-full border border-dashed border-fg px-4 py-2 text-sm font-semibold">
                {dict.codeSoon}
              </p>
            )}
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

function ProjectCard({
  project,
  dict,
  delay,
}: {
  project: Project;
  dict: Dict;
  delay: number;
}) {
  const text = dict.items[project.id];

  return (
    <Reveal delay={delay}>
      <TiltCard
        label={project.repo ? dict.codeLabel : undefined}
        className="flex min-w-0 flex-col gap-5 rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-fg"
      >
        {"image" in project && "imageAlt" in text && (
          <ProjectImage
            image={project.image}
            alt={text.imageAlt}
            video={"video" in project ? project.video : undefined}
            webm={"videoWebm" in project}
          />
        )}
        <p className="font-display text-xs uppercase tracking-[0.2em] text-muted">
          {text.tag}
        </p>
        <h3 className="font-display text-2xl font-bold uppercase leading-tight [overflow-wrap:anywhere] sm:text-3xl">
          {text.name}
        </h3>
        <p className="text-sm font-semibold">{text.status}</p>
        <p className="leading-7 text-muted">{text.summary}</p>
        <Detail label={dict.partLabel} text={text.part} />
        <Detail label={dict.learnedLabel} text={text.learned} />
        <TechChips tech={project.tech} />
        {project.repo && (
          <CodeLink href={project.repo} label={dict.codeLabel} />
        )}
      </TiltCard>
    </Reveal>
  );
}

export default function Projects({ dict }: { dict: Dict }) {
  const featured = projects.find((project) => project.featured);
  const others = projects.filter((project) => !project.featured);

  return (
    <SectionShell
      id="projetos"
      index={dict.index}
      title={dict.title}
      intro={dict.intro}
    >
      <div className="space-y-6">
        {featured && <FeaturedProject project={featured} dict={dict} />}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {others.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              dict={dict}
              delay={0.1 * index}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
