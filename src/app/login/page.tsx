'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AppFooter from '@/components/AppFooter'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const user = await signInWithGoogle()

      if (user) {
        // Get ID token and send to server
        const idToken = await user.getIdToken()

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        })

        const data = await response.json()

        if (data.status) {
          toast.success('Login berhasil!', {
            description: `Selamat datang, ${data.data.name}!`
          })

          // Redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        } else {
          toast.error('Login gagal', {
            description: data.message || 'Terjadi kesalahan saat login'
          })
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Login gagal', {
        description: error.message || 'Terjadi kesalahan saat login'
      })
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
              <Link href="/products" className="text-slate-300 hover:text-white transition-colors">
                Produk
              </Link>
              <Link href="/" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                Beranda
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-6">
              <h1 className="text-3xl font-bold text-slate-800">Login</h1>
              <p className="text-slate-600">
                Masuk untuk mengakses dashboard dan fitur lainnya
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Google Login Button */}
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12 text-base bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Masuk dengan Google
                  </>
                )}
              </Button>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 text-center">
                  Gunakan akun Google yang terverifikasi untuk masuk.
                  Akun admin memiliki akses penuh ke semua fitur.
                </p>
              </div>

              {/* Back to Home */}
              <div className="text-center">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Kembali ke Beranda
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <p className="mb-2">Butuh bantuan?</p>
            <Link
              href="https://wa.me/6281359123789"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Hubungi WhatsApp
            </Link>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
