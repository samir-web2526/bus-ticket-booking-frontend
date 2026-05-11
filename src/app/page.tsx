import { Navbar } from "@/src/components/Pages/shared/Navbar";
import Footer from "@/src/components/Pages/HomePage/Footer";
import { getUser } from "@/src/services/auth/action";

// Import HomePage Components
import HeroSection from "@/src/components/Pages/HomePage/Banner";
import StatsSection from "@/src/components/Pages/HomePage/Stats";
import ServicesSection from "@/src/components/Pages/HomePage/Services";
import RoutesSection from "@/src/components/Pages/HomePage/Route";
import BusesSection from "@/src/components/Pages/HomePage/AllBuses";
import AppDownloadSection from "@/src/components/Pages/HomePage/AppDownload";
import TestimonialsSection from "@/src/components/Pages/HomePage/Testimonial";
import FaqSection from "@/src/components/Pages/HomePage/Faq";
import BlogSection from "@/src/components/Pages/HomePage/Blog";
import ContactSection from "@/src/components/Pages/HomePage/Contact";
import NewsletterSection from "@/src/components/Pages/HomePage/Newsletter";
import PartnersSection from "@/src/components/Pages/HomePage/Partners";

export default async function HomePage() {
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      
      <main className="flex-grow">
        {/* Rich Landing Page Assembly */}
        <HeroSection />
        <PartnersSection />
        <StatsSection />
        <ServicesSection />
        <RoutesSection />
        <BusesSection />
        <TestimonialsSection />
        <AppDownloadSection />
        <BlogSection />
        <FaqSection />
        <ContactSection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
