import { Globe } from "@/components/Globe";

const TAGS = ["DevOps", "Distributed Systems", "Full-Stack", "Infrastructure as Code", "Observability"];

export function About() {
  return (
    <section id="about" className="band band-line">
      <div className="wrap grid items-center gap-[clamp(40px,6vw,80px)] md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="eyebrow">01 — About</span>
          <h2 className="mt-[18px] text-[clamp(30px,5vw,50px)]">Systems thinker, full-stack builder.</h2>
          <p className="mt-5 text-[clamp(16px,2vw,19px)] text-muted">
            I&apos;m a software and cloud engineer based in Los Angeles, finishing my{" "}
            <strong className="font-semibold text-text">B.S. in Software Engineering at UC Irvine</strong>. I&apos;m
            happiest in the layer where code meets infrastructure — designing event-driven microservices, wiring up
            observability, and making deploys boring and repeatable.
          </p>
          <p className="mt-5 text-[clamp(16px,2vw,19px)] text-muted">
            At <strong className="font-semibold text-text">Compassion International</strong> I shipped AWS microservices
            handling 10k+ requests a day; in{" "}
            <strong className="font-semibold text-text">UCI&apos;s Language &amp; Learning Analytics Lab</strong> I built
            research dashboards used by 20+ researchers. I like work that&apos;s equal parts rigorous and useful.
          </p>
          <div className="mt-[30px] flex flex-wrap gap-[9px]">
            {TAGS.map((t) => (
              <span
                key={t}
                className="rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent-hi"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[460px] md:max-w-none">
          <Globe />
          <div className="pointer-events-none absolute inset-x-0 bottom-1 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
            drag to spin · regions I&apos;ve deployed to
          </div>
        </div>
      </div>
    </section>
  );
}
