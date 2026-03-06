import Header from "@/components/layout/Header";
import Hero from "@/components/landing/Hero";
import LogoBanner from "@/components/landing/LogoBanner";
import CardLegends from "@/components/landing/CardLegends";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Showcase from "@/components/landing/Showcase";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LogoBanner />
        <CardLegends />
        <Features />
        <HowItWorks />
        <Showcase />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
