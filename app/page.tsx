import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        {/* sections get added here as we build them: <Experience/>, <Projects/>, … */}
      </main>
    </>
  );
}