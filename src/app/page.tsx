import { WelcomeTransition } from "@/components/animations/WelcomeTransition";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";

export default function HomePage() {
  return (
    <>
      <WelcomeTransition />

      <Navbar />

      <main className="min-h-screen bg-white text-black">
        <HeroSection />
        <ServicesSection />
        <GallerySection />
        <PackagesSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}