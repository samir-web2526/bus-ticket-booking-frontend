import BusesSection from '@/src/components/Pages/HomePage/AllBuses'
import HeroSection from '@/src/components/Pages/HomePage/Banner'
import FeaturesSection from '@/src/components/Pages/HomePage/Features'
import Footer from '@/src/components/Pages/HomePage/Footer'
import RoutesSection from '@/src/components/Pages/HomePage/Route'
import TestimonialsSection from '@/src/components/Pages/HomePage/Testimonial'
import React from 'react'

export default function HomePage() {
  return (
    <div>
        <HeroSection></HeroSection>
        <RoutesSection></RoutesSection>
        <BusesSection></BusesSection>
        <FeaturesSection></FeaturesSection>
        <TestimonialsSection></TestimonialsSection>
        <Footer></Footer>
    </div>
  )
}
