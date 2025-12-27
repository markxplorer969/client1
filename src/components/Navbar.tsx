'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User, ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0f0f0f]/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/10 to-purple-400/10 border border-cyan-400/20 flex items-center justify-center group-hover:border-cyan-400/50 transition-all duration-300">
                <span className="text-xl font-bold text-white">Y</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white tracking-tight">
                  Yilzi
                </span>
                <span className="text-cyan-400 font-bold">
                  Digitalz
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/products" className="px-4 py-2 text-sm text-gray-400 hover:text-cyan-400 font-medium transition-colors rounded-lg hover:bg-cyan-400/5">
                Produk
              </Link>
              <Link href="/dashboard" className="px-4 py-2 text-sm text-gray-400 hover:text-cyan-400 font-medium transition-colors rounded-lg hover:bg-cyan-400/5">
                Dashboard
              </Link>

              {/* Login/Logout Button */}
              {loading ? (
                <div className="w-20 h-10 bg-white/5 rounded-lg animate-pulse" />
              ) : user ? (
                <button
                  onClick={() => {
                    logout()
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              ) : (
                <Link href="/login">
                  <button className="flex items-center gap-2 px-6 py-2 text-sm font-semibold bg-cyan-400 border border-cyan-400/30 text-black rounded-lg hover:bg-cyan-300 hover:border-cyan-300/50 transition-all duration-300">
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Masuk</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-20 bg-[#0f0f0f] backdrop-blur-xl">
          <div className="container mx-auto px-4 py-8 space-y-2">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-4 text-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-xl transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              Produk
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-4 text-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-xl transition-all"
            >
              <span className="w-5 h-5" />
              Dashboard
            </Link>

            <div className="border-t border-white/5 pt-4 mt-4">
              {loading ? (
                <div className="w-full h-14 bg-white/5 rounded-xl animate-pulse" />
              ) : user ? (
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-5 py-4 text-lg font-medium bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-lg font-semibold bg-cyan-400 border border-cyan-400/30 text-black rounded-xl hover:bg-cyan-300 transition-all"
                >
                  <User className="w-5 h-5" />
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
