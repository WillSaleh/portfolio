const LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[var(--gutter)] py-4">
      <a href="#top" className="flex items-center gap-3 font-display text-[17px] font-bold tracking-wide">
        <span
          className="size-2.5 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-dim)]"
          style={{ animation: "pulse 2.6s var(--ease) infinite" }}
        />
        William&nbsp;Saleh
      </a>

      {/* links hide on small screens; we'll add a mobile menu with the interactivity pass */}
      <div className="hidden items-center gap-8 md:flex">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="font-mono text-[13px] text-muted transition-colors hover:text-text">
            {l.label}
          </a>
        ))}
        <a href="/WilliamSaleh_Resume.pdf" download className="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" /></svg>
          Résumé
        </a>
      </div>
    </nav>
  );
}