import HeroSection from '@/components/sections/HeroSection';
import ServicesCarousel from '@/components/sections/ServicesCarousel';
import AboutSection from '@/components/sections/AboutSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import CTASection from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesCarousel />
      <AboutSection />
      <ReviewsSection />
      <CTASection />
    </>
  );
}
