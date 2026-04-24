import BusesSection from '@/src/components/Pages/HomePage/AllBuses'
import HeroSection from '@/src/components/Pages/HomePage/Banner'
import RoutesSection from '@/src/components/Pages/HomePage/Route'
import React from 'react'

export default function HomePage() {
  return (
    <div>
        <HeroSection></HeroSection>
        <RoutesSection></RoutesSection>
        <BusesSection></BusesSection>
    </div>
  )
}
