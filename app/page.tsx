
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Pricing from "../components/landing/Pricing";
import Testimonials from "../components/landing/Testimonials";

export default function Home() {
  return (
    <main className="bg-[#05060a] text-white">
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
    </main>
  );
}
