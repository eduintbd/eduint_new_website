import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import AIMatching from "@/components/landing/AIMatching";
import Services360 from "@/components/landing/Services360";
import Testimonials from "@/components/landing/Testimonials";
import Partners from "@/components/landing/Partners";
import Destinations from "@/components/landing/Destinations";
import FAQ from "@/components/landing/FAQ";
import CTASection from "@/components/landing/CTASection";
import VisaSuccessWall from "@/components/landing/VisaSuccessWall";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <AIMatching />
      <Services360 />
      <VisaSuccessWall />
      <Testimonials />
      <Partners />
      <Destinations />
      <FAQ />
      <CTASection />
    </>
  );
}
