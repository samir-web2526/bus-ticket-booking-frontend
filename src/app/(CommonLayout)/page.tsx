import BusesSection from '@/src/components/Pages/HomePage/AllBuses'
import HeroSection from '@/src/components/Pages/HomePage/Banner'
import FeaturesSection from '@/src/components/Pages/HomePage/Features'
import Footer from '@/src/components/Pages/HomePage/Footer'
import RoutesSection from '@/src/components/Pages/HomePage/Route'
import TestimonialsSection from '@/src/components/Pages/HomePage/Testimonial'
import StatsSection from '@/src/components/Pages/HomePage/Stats'
import ServicesSection from '@/src/components/Pages/HomePage/Services'
import PartnersSection from '@/src/components/Pages/HomePage/Partners'
import FaqSection from '@/src/components/Pages/HomePage/Faq'
import BlogSection from '@/src/components/Pages/HomePage/Blog'
import AppDownloadSection from '@/src/components/Pages/HomePage/AppDownload'
import NewsletterSection from '@/src/components/Pages/HomePage/Newsletter'
import React from 'react'

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="flex flex-col">
        <HeroSection />
        <PartnersSection />
        <StatsSection />
        <ServicesSection />
        <RoutesSection />
        <BusesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FaqSection />
        <BlogSection />
        <AppDownloadSection />
        <NewsletterSection />
        <Footer />
    </div>
  )
}

