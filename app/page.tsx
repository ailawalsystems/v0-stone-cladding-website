import Header from '@/components/header'
import Hero from '@/components/sections/hero'
import Overview from '@/components/sections/overview'
import Services from '@/components/sections/services'
import WhyStone from '@/components/sections/why-stone'
import Portfolio from '@/components/sections/portfolio'
import Materials from '@/components/sections/materials'
import Testimonials from '@/components/sections/testimonials'
import Contact from '@/components/sections/contact'
import CursorTracker from '@/components/cursor-tracker'

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] overflow-hidden pt-16">
      <CursorTracker />
      <Header />
      <Hero />
      <Overview />
      <Services />
      <WhyStone />
      <Portfolio />
      <Materials />
      <Testimonials />
      <Contact />
    </main>
  )
}
