import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CategoryGrid } from "@/components/landing/category-grid";
import { FeaturedVendors } from "@/components/landing/featured-vendors";
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryGrid />
        <FeaturedVendors />
        <HowItWorks />
        <WhyChooseUs />
        <TestimonialSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
