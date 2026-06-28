import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* sections get added here as we build them: <About/>, <Experience/>, … */}
      </main>
    </>
  );
}