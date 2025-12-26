'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, ShoppingCart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/Alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { getProduct } from '@/lib/firebase/db'

interface AdditionalInfo {
  name: string
  value: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  label?: string
  category?: string
  stock_available?: boolean
  sold_count?: number
  rating?: number
  show?: boolean
  imageUrl?: string
  image?: string
  additional_information?: AdditionalInfo[]
  file?: string
}

interface BuyCardProps {
  product: Product
}

export default function BuyCard({ product: initialProduct }: BuyCardProps) {
  const { user, loading: authLoading, signInWithGoogle } = useAuth()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(initialProduct)
  const [isLoading, setIsLoading] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('purchase')

  // Form state
  const [purchaseFormData, setPurchaseFormData] = useState<AdditionalInfo[]>([])

  useEffect(() => {
    if (initialProduct?.additional_information && Array.isArray(initialProduct.additional_information)) {
      setPurchaseFormData(initialProduct.additional_information.map(info => ({
        name: info.name,
        value: ''
      })))
    }
    setProduct(initialProduct)
  }, [initialProduct])

  // Calculate pricing
  const TAX_PERCENT = 10
  const platformFee = product?.price ? product.price * (TAX_PERCENT / 100) : 0
  const totalPrice = (product?.price || 0) + platformFee

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value || 0)
  }

  const updatePurchaseInfo = (index: number, value: string) => {
    const newData = [...purchaseFormData]
    newData[index].value = value
    setPurchaseFormData(newData)
  }

  const openWhatsApp = () => {
    const phoneNumber = '6281359123789'
    const message = `Halo, saya ingin bertanya tentang produk: ${product?.name}`
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handlePurchase = async () => {
    // Check if user is logged in
    if (!user && !authLoading) {
      toast.info('Login Diperlukan', {
        description: 'Silakan login terlebih dahulu untuk melakukan pembelian.'
      })
      // Save product ID to localStorage and redirect to login
      localStorage.setItem('redirectAfterLogin', '/product/' + product?.id)
      router.push('/login')
      return
    }

    // Check if product is available
    if (!product?.stock_available) {
      toast.error('Stok Habis', {
        description: 'Maaf, stok produk ini telah habis.'
      })
      return
    }

    // Validate form fields
    for (const info of purchaseFormData) {
      if (!info.value.trim()) {
        toast.error('Data Tidak Lengkap', {
          description: `Harap isi kolom "${info.name}" terlebih dahulu.`
        })
        setActiveTab('purchase')
        return
      }
    }

    setIsPurchasing(true)
    setError(null)
    setPaymentUrl(null)

    try {
      // Call payment create API
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product?.id,
          additional_information: purchaseFormData
        })
      })

      const result = await response.json()

      if (!result.status) {
        throw new Error(result.message || 'Gagal membuat pembayaran')
      }

      // Reset form on success
      setPurchaseFormData(purchaseFormData.map(info => ({ ...info, value: '' })))

      // Show success message
      toast.success('Invoice Berhasil Dibuat', {
        description: 'Mengarahkan ke halaman pembayaran...'
      })

      // Set payment URL
      setPaymentUrl(result.data?.payment_url || result.data?.redirect_url || result.data?.qr_string || '')

      // Redirect to invoice page
      if (result.data?.redirect) {
        setTimeout(() => {
          router.push(result.data.redirect)
        }, 1500)
      }

    } catch (err: any) {
      console.error('Purchase error:', err)
      setError(err.message || 'Terjadi kesalahan saat memproses pembelian')
      toast.error('Gagal Membeli Produk', {
        description: err.message || 'Terjadi kesalahan yang tidak diketahui'
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleLogin = async () => {
    try {
      await signInWithGoogle()
      toast.success('Login Berhasil', {
        description: 'Anda dapat melanjutkan pembelian.'
      })
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  const handlePayNow = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank')
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg sticky top-24">
        <CardContent className="p-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="ml-3 text-slate-600">Memuat produk...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stockAvailable = product?.stock_available !== false && ((product?.stock_available ?? 0) > 0 || (product?.stock ?? 0) > 0)

  return (
    <Card className="bg-white shadow-lg sticky top-24">
      <CardContent className="p-6 space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchase">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Pembelian
            </TabsTrigger>
            <TabsTrigger value="payment">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v4a3 3 0 003 3z" />
              </svg>
              Pembayaran
            </TabsTrigger>
          </TabsList>

          {/* Purchase Tab */}
          <TabsContent value="purchase" className="space-y-6">
            {/* Price Section */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-blue-600">
                Rp {formatCurrency(product?.price || 0)}
              </h3>
              {product?.original_price && (
                <span className="text-base text-slate-500 line-through">
                  Rp {formatCurrency(product.original_price)}
                </span>
              )}
            </div>

            {/* Auth Status */}
            {authLoading ? (
              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="text-sm text-slate-600">Memeriksa status login...</p>
              </div>
            ) : !user ? (
              <Alert
                variant="info"
                message="Silakan login untuk melanjutkan pembelian."
                className="!bg-blue-50 !border-blue-200 !text-blue-800"
              />
            ) : (
              <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700">
                  Login sebagai <span className="font-semibold">{user?.displayName || user?.email}</span>
                </p>
              </div>
            )}

            {/* Purchase Form */}
            {user && stockAvailable && !paymentUrl && (
              <>
                {/* Additional Information Fields */}
                {purchaseFormData.length > 0 && (
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-4">Lengkapi Data Pesanan</h4>
                    {purchaseFormData.map((info, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`info-${index}`}>{info.name}</Label>
                        <Input
                          id={`info-${index}`}
                          type="text"
                          value={info.value}
                          onChange={(e) => updatePurchaseInfo(index, e.target.value)}
                          placeholder={`Masukkan ${info.name}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Payment Summary */}
                <div className="space-y-3 p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Harga Produk</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Rp {formatCurrency(product?.price || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Biaya Layanan ({TAX_PERCENT}%)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Rp {formatCurrency(platformFee)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      Rp {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    product?.stock_available ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {product?.stock_available ? (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-semibold ${product?.stock_available ? 'text-green-700' : 'text-red-700'}`}>
                    {product?.stock_available ? 'Stok Tersedia' : 'Stok Habis'}
                  </span>
                </div>

                {/* Error */}
                {error && (
                  <Alert
                    variant="danger"
                    message={error}
                    dismissible
                    onClose={() => setError(null)}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={openWhatsApp}
                    className="flex-1 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={handlePurchase}
                    disabled={isPurchasing || !product?.stock_available}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        <span>Beli Sekarang</span>
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Login Button for non-logged in users */}
            {!user && !authLoading && (
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                >
                  Login dengan Google
                </Button>
                <Button
                  variant="outline"
                  onClick={openWhatsApp}
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Tanya via WhatsApp
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            {!paymentUrl ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v4a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800">Menunggu Pembayaran</h3>
                  <p className="text-slate-600">Silakan klik tombol "Beli Sekarang" terlebih dahulu untuk membuat invoice.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800">Metode Pembayaran</h3>
                  <p className="text-slate-600">Klik tombol di bawah untuk membuka halaman pembayaran Tripay.</p>
                </div>

                <Button
                  onClick={handlePayNow}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6h-2" />
                  </svg>
                  Bayar Sekarang
                </Button>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total Pembayaran</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      Rp {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Pembayaran akan diverifikasi otomatis oleh Tripay.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Product Info */}
        {product && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Produk:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{product.name}</span>
              </div>
              {product.category && (
                <div className="flex justify-between">
                  <span>Kategori:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{product.category}</span>
                </div>
              )}
              {product.sold_count && (
                <div className="flex justify-between">
                  <span>Terjual:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{product.sold_count}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
