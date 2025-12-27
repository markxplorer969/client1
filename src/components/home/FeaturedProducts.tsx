'use client'

import { useState, useEffect } from 'react'
import ProductCardNeo from './ProductCardNeo'
import { Loader2, Sparkles } from 'lucide-react'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/products?top=true&limit=4')
      const result = await response.json()

      if (result.status && result.data) {
        const productsList = result.data.products || result.data || []
        setProducts(productsList)
      } else {
        throw new Error(result.message || 'Gagal mengambil produk unggulan')
      }
    } catch (err: any) {
      console.error('Error loading featured products:', err)
      setError(err.message || 'Terjadi kesalahan saat memuat produk')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative py-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-300 tracking-[0.2em] uppercase">
              Produk Pilihan
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Unggulan
            <span className="text-cyan-400">
              Minggu Ini
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Koleksi produk digital terbaik yang paling diminati
            <br className="hidden md:block" />
            oleh komunitas kami.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
            <p className="text-gray-400">Memuat produk...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center mb-8 backdrop-blur-sm">
            <p className="text-red-400 font-semibold mb-2">⚠️ Error</p>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCardNeo key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-24 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Produk Segera Hadir
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Kami sedang mempersiapkan koleksi produk digital terbaik untuk Anda.
              <br />
              Nantikan update terbaru!
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-white/5 text-gray-400 font-medium cursor-not-allowed">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Coming Soon</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
