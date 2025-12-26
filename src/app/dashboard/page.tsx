'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AppFooter from '@/components/AppFooter'
import { useAuth } from '@/contexts/AuthContext'
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Loader2,
  LogOut,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user, loading, isAdmin, logout } = useAuth()
  const router = useRouter()

  const [products, setProducts] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalUsers: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Akses ditolak', {
        description: 'Silakan login terlebih dahulu'
      })
      router.push('/login')
      return
    }

    if (user) {
      loadDashboardData()
    }
  }, [user, loading, router])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // TODO: Fetch real data from Firestore
      // For now, using mock data
      setTimeout(() => {
        setStats({
          totalProducts: 12,
          totalSales: 156,
          totalRevenue: 45600000,
          totalUsers: 89
        })
        setProducts([
          {
            id: '1',
            name: 'WhatsApp Bot Script Premium',
            price: 150000,
            sales: 45,
            stock_available: true
          },
          {
            id: '2',
            name: 'Website Toko Online',
            price: 750000,
            sales: 23,
            stock_available: true
          },
          {
            id: '3',
            name: 'Instagram Automation Tool',
            price: 250000,
            sales: 67,
            stock_available: false
          }
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Gagal memuat data', {
        description: 'Terjadi kesalahan saat memuat data dashboard'
      })
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value || 0)
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logout berhasil', {
        description: 'Anda telah keluar dari akun'
      })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout gagal', {
        description: 'Terjadi kesalahan saat logout'
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-white">
              Yilzi Digitalz
            </Link>
          </div>
        </nav>
        <main className="flex-grow pt-24 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </main>
        <AppFooter />
      </div>
    )
  }

  if (isAdmin) {
    return <AdminDashboard stats={stats} products={products} user={user} onLogout={handleLogout} />
  }

  return <UserDashboard user={user} onLogout={handleLogout} />
}

// Admin Dashboard Component
function AdminDashboard({
  stats,
  products,
  user,
  onLogout
}: {
  stats: any
  products: any[]
  user: any
  onLogout: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                Yilzi Digitalz
              </Link>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Admin
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-300 hidden md:block">
                {user?.displayName || user?.email}
              </span>
              <Button
                onClick={onLogout}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard Admin</h1>
            <p className="text-slate-600">
              Kelola produk, pantau penjualan, dan analisis performa toko
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Produk</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Penjualan</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.totalSales}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Pendapatan</p>
                    <p className="text-3xl font-bold text-slate-800">Rp {(stats.totalRevenue / 1000000).toFixed(1)}Jt</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Pengguna</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Manajemen Produk</CardTitle>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{product.name}</h3>
                        <p className="text-sm text-slate-600">
                          Rp {formatCurrency(product.price)} • {product.sales} terjual
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={product.stock_available ? 'default' : 'secondary'}
                        className={product.stock_available ? 'bg-green-600' : 'bg-slate-600'}
                      >
                        {product.stock_available ? 'Tersedia' : 'Habis'}
                      </Badge>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

// User Dashboard Component
function UserDashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    // TODO: Fetch user's invoices from Firestore
    setInvoices([
      {
        id: 'INV-001',
        amount: 150000,
        status: 'Paid',
        created_at: new Date('2025-01-15'),
        items: [{ productName: 'WhatsApp Bot Script Premium' }]
      },
      {
        id: 'INV-002',
        amount: 750000,
        status: 'Pending',
        created_at: new Date('2025-01-20'),
        items: [{ productName: 'Website Toko Online' }]
      }
    ])
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value || 0)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                Yilzi Digitalz
              </Link>
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                User
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-300 hidden md:block">
                {user?.displayName || user?.email}
              </span>
              <Button
                onClick={onLogout}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard Saya</h1>
            <p className="text-slate-600">
              Pantau pembelian dan unduh produk yang telah Anda beli
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Selamat Datang, {user?.displayName || 'Pengguna'}!</h2>
                  <p className="text-blue-100">Terima kasih telah berbelanja di toko kami</p>
                </div>
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="bg-white text-blue-600 border-0 hover:bg-blue-50"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Belanja Lagi
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Purchase History */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pembelian</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="paid">Lunas</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-4">
                  {invoices.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 mb-4">Belum ada pembelian</p>
                      <Link href="/products">
                        <Button>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Lihat Produk
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    invoices.map((invoice) => (
                      <Card key={invoice.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-800">{invoice.id}</h3>
                                <Badge
                                  variant={
                                    invoice.status === 'Paid'
                                      ? 'default'
                                      : invoice.status === 'Pending'
                                      ? 'secondary'
                                      : 'destructive'
                                  }
                                  className={
                                    invoice.status === 'Paid'
                                      ? 'bg-green-600'
                                      : invoice.status === 'Pending'
                                      ? 'bg-yellow-600'
                                      : 'bg-red-600'
                                  }
                                >
                                  {invoice.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600">
                                {invoice.items.map((item: any) => item.productName).join(', ')}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                {invoice.created_at.toLocaleDateString('id-ID')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">
                                Rp {formatCurrency(invoice.amount)}
                              </p>
                              {invoice.status === 'Paid' && (
                                <Button variant="outline" className="mt-2">
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="paid" className="space-y-4 mt-4">
                  {invoices
                    .filter((inv) => inv.status === 'Paid')
                    .map((invoice) => (
                      <Card key={invoice.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-800">{invoice.id}</h3>
                                <Badge className="bg-green-600">Paid</Badge>
                              </div>
                              <p className="text-sm text-slate-600">
                                {invoice.items.map((item: any) => item.productName).join(', ')}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                {invoice.created_at.toLocaleDateString('id-ID')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">
                                Rp {formatCurrency(invoice.amount)}
                              </p>
                              <Button variant="outline" className="mt-2">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="pending" className="space-y-4 mt-4">
                  {invoices
                    .filter((inv) => inv.status === 'Pending')
                    .map((invoice) => (
                      <Card key={invoice.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-800">{invoice.id}</h3>
                                <Badge className="bg-yellow-600">Pending</Badge>
                              </div>
                              <p className="text-sm text-slate-600">
                                {invoice.items.map((item: any) => item.productName).join(', ')}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                {invoice.created_at.toLocaleDateString('id-ID')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">
                                Rp {formatCurrency(invoice.amount)}
                              </p>
                              <Button className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                                Bayar Sekarang
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
