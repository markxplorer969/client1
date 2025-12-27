'use client'

import Link from 'next/link'
import { ShoppingCart, Star, Download } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl?: string
  stock_available: boolean
  sales: number
  label?: string | null
}

interface ProductCardNeoProps {
  product: Product
}

export default function ProductCardNeo({ product }: ProductCardNeoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price)
  }

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="relative h-full bg-[#0f0f0f] backdrop-blur-sm border border-white/5 rounded-xl p-5 transition-all duration-300 hover:border-white/10 hover:bg-[#141417] hover:scale-[1.02]">
        {/* Top Line */}
        <div className="absolute top-0 left-4 right-4 h-px bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Label Badge */}
        {product.label && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">
              {product.label}
            </span>
          </div>
        )}

        {/* Product Image/Placeholder */}
        <div className="relative w-full h-52 bg-gradient-to-br from-[#1a1a20] to-[#0d0d10] rounded-lg mb-4 overflow-hidden">
          {/* Corner Accents */}
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/10" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/10" />

          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <span className="text-3xl font-bold text-gray-500">
                  {product.name.charAt(0)}
                </span>
              </div>
            </div>
          )}

          {/* Stock Overlay */}
          {!product.stock_available && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center rounded-lg">
              <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="text-sm font-bold text-red-400 tracking-wide uppercase">
                  Stok Habis
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Rating Badge */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${star <= 4 ? 'fill-cyan-400 text-cyan-400' : 'fill-gray-700 text-gray-700'}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.sales} terjual)</span>
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between mb-4 pb-4 border-b border-white/5">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em] mb-1">Harga</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              Rp {formatPrice(product.price)}
            </p>
          </div>
          {product.stock_available && (
            <div className="text-right">
              <p className="text-[10px] text-cyan-400/70 uppercase tracking-[0.15em] mb-1">Status</p>
              <p className="text-sm font-semibold text-emerald-400">
                Tersedia
              </p>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button className="w-full h-12 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-lg transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-black active:scale-95 flex items-center justify-center gap-2">
          <span className="group-hover:text-black">Lihat Detail</span>
          <ShoppingCart className="w-4 h-4 group-hover:text-black transition-colors" />
        </button>
      </div>
    </Link>
  )
}
