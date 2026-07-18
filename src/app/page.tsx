 
 
import FeaturedRecipesSection from "@/components/home/FeaturedRecipesSection";
import AiTeaserSection from "@/components/home/AiTeaserSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import StatsSection from "@/components/home/StatsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import FaqSection from "@/components/home/FaqSection";
import CtaBannerSection from "@/components/home/CtaBannerSection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <FeaturedRecipesSection />
      <AiTeaserSection />
      <CategoriesSection />
      <TestimonialsSection />
      <StatsSection />
      <NewsletterSection />
      <FaqSection />
      <CtaBannerSection />
    </div>
  );
}