import { HeroSection } from "@/components/home/hero-section"
import { FilmStripGallery } from "@/components/home/film-strip-gallery"
import { CategoriesSection } from "@/components/home/categories-section"
import  AboutSection  from "@/components/home/about-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <HeroSection />
      <FilmStripGallery />
      <CategoriesSection />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
