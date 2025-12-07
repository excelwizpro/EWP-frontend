import { Hero } from "./Hero";
import { Features } from "./Features";
import { Flow } from "./Flow";
import { Preview } from "./Preview";
import { Footer } from "./Footer";

export function LandingPage() {
  return (
    <div className="bg-white text-slate-900">
      <Hero />
      <Features />
      <Flow />
      <Preview />
      <Footer />
    </div>
  );
}
