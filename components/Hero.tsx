export function Hero() {
  return (
    <header id="top" className="relative flex min-h-svh items-center overflow-hidden pt-20">
      <div className="hero-grid" />
      {/* the particle network <HeroNet /> mounts here next — leaving room for it */}

      <div className="wrap relative z-10">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-line-soft bg-[oklch(0.20_0.010_65/0.5)] px-3.5 py-[7px] font-mono text-[12.5px] text-muted backdrop-blur">
          <span className="size-[7px] rounded-full bg-[oklch(0.78_0.16_145)] shadow-[0_0_8px_oklch(0.78_0.16_145)]" />
          Available · New grad 2026 · Los Angeles, CA
        </div>

        <h1 className="mt-6 font-display text-[clamp(48px,11vw,132px)] leading-[1.04] tracking-[-0.04em]">
          <span className="block">William</span>
          <span className="block">Saleh</span>
        </h1>

        {/* static for now — becomes a typewriter in the interactivity pass */}
        <div className="mt-5 font-mono text-[clamp(14px,2.4vw,20px)] tracking-[0.04em] text-accent">
          Cloud / DevOps Engineer
          <span
            className="ml-1 inline-block h-[1.05em] w-2 translate-y-0.5 bg-accent"
            style={{ animation: "caret 1s steps(1) infinite" }}
          />
        </div>

        <p className="mt-6 max-w-[50ch] text-[clamp(16px,2.2vw,20px)] text-muted">
          I build and ship cloud infrastructure that scales — from AWS microservices and
          Kubernetes routing to the full-stack apps that ride on top of them.
        </p>

        <div className="mt-9 flex flex-wrap gap-3.5">
          <a href="#projects" className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m0 0l-6-6m6 6l-6 6" /></svg>
            View work
          </a>
          <a href="/WilliamSaleh_Resume.pdf" download className="btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" /></svg>
            Download résumé
          </a>
        </div>

        <div className="mt-[54px] flex flex-wrap gap-6 font-mono text-[12.5px] text-faint">
          <span><b className="font-medium text-text">UC&nbsp;Irvine</b> · B.S. Software Engineering</span>
          <span><b className="font-medium text-text">AWS</b> Certified Cloud Practitioner</span>
        </div>
      </div>
    </header>
  );
}