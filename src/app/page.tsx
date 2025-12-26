'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import HeroSection from '@/components/HeroSection'
import ProductList from '@/components/ProductList'
import FaqSection from '@/components/FaqSection'
import AppFooter from '@/components/AppFooter'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch featured products on mount
  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Get top 8 products from API
      const response = await fetch('/api/products?top=true&limit=8')
      const result = await response.json()

      if (result.status && result.data) {
        const products = result.data.products || result.data || []
        setFeaturedProducts(products)
      } else {
        throw new Error(result.message || 'Gagal mengambil produk unggulan')
      }
    } catch (err: any) {
      console.error('Error loading featured products:', err)
      setError(err.message || 'Terjadi kesalahan saat memuat produk unggulan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
              Yilzi Digitalz
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="text-slate-300 hover:text-white transition-colors hidden md:block"
              >
                Produk
              </Link>
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors hidden md:block">
                Dashboard
              </Link>
              <Link href="/login">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {/* Hero Section with Featured Products */}
        <HeroSection />

        {/* Featured Products Section */}
        <section id="featured-products" className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-2">
                Produk Unggulan
              </h2>
              <p className="text-lg text-slate-600">
                Produk digital terbaik untuk kebutuhan bisnis Anda
              </p>
            </div>
            <Link href="/products">
              <button className="hidden md:inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-6 py-3 rounded-lg font-semibold border-2 border-slate-200 transition-all hover:-translate-y-1">
                Lihat Semua Produk
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-lg text-slate-600">Memuat produk unggulan...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center mb-8">
              <p className="text-red-800 font-semibold mb-2">⚠️ Error</p>
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadFeaturedProducts}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && featuredProducts.length > 0 && (
            <ProductList products={featuredProducts} />
          )}

          {/* Empty State */}
          {!isLoading && !error && featuredProducts.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-slate-200">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 002 2H6a2 2 0 002-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414-2.414a1 1 0 01-.293-.707V5a2 2 0 012-2h2.586a1 1 0 001.414.586l2.414 2.414a1 1 0 01.293.707L20 12.586V10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Belum Ada Produk</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Saat ini tidak ada produk yang tersedia. Nantikan produk digital terbaru dari kami!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={loadFeaturedProducts}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-lg font-semibold border-2 border-slate-200 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <Link href="/products">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold">
                    Lihat Semua Produk
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Mobile View All Button */}
          {!isLoading && featuredProducts.length > 0 && (
            <div className="md:hidden text-center mt-8">
              <Link href="/products">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold">
                  Lihat Semua Produk
                </button>
              </Link>
            </div>
          )}
        </section>

        {/* FAQ Section */}
        {!isLoading && featuredProducts.length > 0 && (
          <FaqSection />
        )}
      </main>

      <AppFooter />
    </div>
  )
}
