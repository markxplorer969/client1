import AppFooter from '@/components/AppFooter'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import ProcessTimeline from '@/components/home/ProcessTimeline'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] relative overflow-hidden text-white font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pt-28 pb-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Process Timeline */}
        <ProcessTimeline />
      </div>

      {/* Footer */}
      <AppFooter />
    </main>
  )
}
