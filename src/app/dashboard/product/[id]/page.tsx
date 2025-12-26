'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Save, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert } from '@/components/Alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { getProduct, productUpdate, productDelete } from '@/lib/firebase/db'
import { toast } from 'sonner'
import Image from 'next/image'
import AppFooter from '@/components/AppFooter'

interface AdditionalInfo {
  name: string
  value: string
}

export default function EditProductPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  const productFileInputRef = useRef<HTMLInputElement>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    label: '',
    category: '',
    stock_available: true,
    show: true,
    rating: 5,
    sold_count: 0,
    imageUrl: '',
    image: null as File | null,
    file: null as File | string | null,
    additional_information: [] as AdditionalInfo[]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [fileSourceType, setFileSourceType] = useState<'upload' | 'url'>('upload')

  // Redirect checks
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Akses Ditolak', {
        description: 'Silakan login terlebih dahulu'
      })
      router.push('/login')
      return
    }

    if (!authLoading && user && !isAdmin) {
      toast.error('Akses Ditolak', {
        description: 'Halaman ini khusus untuk admin'
      })
      router.push('/dashboard')
      return
    }
  }, [user, isAdmin, authLoading, router])

  // Load product data
  useEffect(() => {
    if (productId) {
      loadProduct()
    }
  }, [productId])

  const loadProduct = async () => {
    try {
      const result = await getProduct(productId)
      if (result.status && result.data) {
        const product = result.data
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          original_price: product.original_price?.toString() || '',
          label: product.label || '',
          category: product.category || '',
          stock_available: product.stock_available ?? true,
          show: product.show ?? true,
          rating: product.rating || 5,
          sold_count: product.sold_count || 0,
          imageUrl: product.imageUrl || product.image || '',
          image: null,
          file: product.file || null,
          additional_information: Array.isArray(product.additional_information)
            ? product.additional_information
            : []
        })
        setImagePreview(product.imageUrl || product.image || null)
      } else {
        throw new Error(result.message || 'Produk tidak ditemukan')
      }
    } catch (err: any) {
      console.error('Error loading product:', err)
      toast.error('Gagal Memuat Produk', {
        description: err.message || 'Terjadi kesalahan saat memuat data produk'
      })
      setTimeout(() => {
        router.push('/dashboard/products')
      }, 2000)
    }
  }

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('id-ID').format(Number(value) || 0)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setFormData(prev => ({ ...prev, image: file, imageUrl: file.name }))
      setHasChanges(true)

      // Preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file) {
      toast.error('Ukuran Gambar Terlalu Besar', {
        description: 'Maksimal 5MB'
      })
    }
  }

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 50 * 1024 * 1024) { // 50MB limit
      setFormData(prev => ({ ...prev, file }))
      setHasChanges(true)
    } else if (file) {
      toast.error('Ukuran File Terlalu Besar', {
        description: 'Maksimal 50MB'
      })
    }
  }

  const addAdditionalInfo = () => {
    setFormData(prev => ({
      ...prev,
      additional_information: [...prev.additional_information, { name: '', value: '' }]
    }))
    setHasChanges(true)
  }

  const removeAdditionalInfo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_information: prev.additional_information.filter((_, i) => i !== index)
    }))
    setHasChanges(true)
  }

  const updateAdditionalInfo = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      additional_information: prev.additional_information.map((info, i) =>
        i === index ? { ...info, [field]: value } : info
      )
    }))
    setHasChanges(true)
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Data Tidak Lengkap', {
        description: 'Nama produk wajib diisi'
      })
      return
    }

    if (!formData.description.trim()) {
      toast.error('Data Tidak Lengkap', {
        description: 'Deskripsi produk wajib diisi'
      })
      return
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error('Data Tidak Lengkap', {
        description: 'Harga produk wajib diisi dengan nilai valid'
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const productData: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : undefined,
        label: formData.label || undefined,
        category: formData.category || undefined,
        stock_available: formData.stock_available,
        show: formData.show,
        rating: formData.rating,
        sold_count: formData.sold_count,
        additional_information: formData.additional_information.length > 0
          ? formData.additional_information
          : undefined
      }

      // Update image URL if changed
      if (formData.image && typeof formData.image === 'object') {
        productData.imageUrl = formData.image.name
        // Here you would upload to Firebase Storage
        console.log('Image to upload:', formData.image.name)
      } else if (formData.imageUrl) {
        productData.imageUrl = formData.imageUrl
      }

      // Update file if changed
      if (formData.file) {
        productData.file = formData.file
      }

      // Update product in Firestore
      const result = await productUpdate(productId, productData)

      if (!result.status) {
        throw new Error(result.message || 'Gagal mengupdate produk')
      }

      toast.success('Produk Berhasil Diupdate', {
        description: `"${formData.name}" telah diupdate`
      })

      // Redirect to products list
      setTimeout(() => {
        router.push('/dashboard/products')
      }, 1500)

    } catch (err: any) {
      console.error('Error updating product:', err)
      setError(err.message || 'Terjadi kesalahan saat mengupdate produk')
      toast.error('Gagal Mengupdate Produk', {
        description: err.message || 'Terjadi kesalahan yang tidak diketahui'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${formData.name}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await productDelete(productId)
      if (result.status) {
        toast.success('Produk Dihapus', {
          description: `"${formData.name}" berhasil dihapus`
        })
        router.push('/dashboard/products')
      } else {
        throw new Error(result.message || 'Gagal menghapus produk')
      }
    } catch (err: any) {
      console.error('Error deleting product:', err)
      toast.error('Gagal Menghapus Produk', {
        description: err.message || 'Terjadi kesalahan saat menghapus produk'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                Yilzi Digitalz
              </Link>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Admin
              </Badge>
            </div>
            <span className="text-slate-300">
              {user?.displayName || user?.email}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/dashboard/products">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Edit Produk</h1>
                <p className="text-slate-600">Edit informasi produk: <span className="font-semibold">{formData.name}</span></p>
              </div>
            </div>

            {/* Product ID Badge */}
            <div className="inline-block">
              <Badge variant="outline" className="text-xs">
                ID: {productId}
              </Badge>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="product" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="product">Produk</TabsTrigger>
                <TabsTrigger value="files">Gambar & File</TabsTrigger>
                <TabsTrigger value="info">Informasi Tambahan</TabsTrigger>
              </TabsList>

              {/* Product Info Tab */}
              <TabsContent value="product" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Informasi Produk
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Nama Produk *</Label>
                      <Input
                        id="productName"
                        value={formData.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="Masukkan nama produk"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productDescription">Deskripsi Produk *</Label>
                      <Textarea
                        id="productDescription"
                        value={formData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Deskripsi lengkap produk..."
                        rows={6}
                        required
                      />
                      <p className="text-sm text-slate-500">
                        Gunakan format Markdown untuk better formatting
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="productPrice">Harga Jual *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            Rp
                          </span>
                          <Input
                            id="productPrice"
                            type="number"
                            min="0"
                            step="1000"
                            value={formData.price}
                            onChange={(e) => handleFieldChange('price', e.target.value)}
                            placeholder="150000"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">
                          Harga Asli
                          <span className="text-slate-500 ml-2">(Opsional)</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            Rp
                          </span>
                          <Input
                            id="originalPrice"
                            type="number"
                            min="0"
                            step="1000"
                            value={formData.original_price}
                            onChange={(e) => handleFieldChange('original_price', e.target.value)}
                            placeholder="200000"
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Harga asli akan ditampilkan sebagai harga coret
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="productBadge">Label Produk</Label>
                        <select
                          id="productBadge"
                          value={formData.label}
                          onChange={(e) => handleFieldChange('label', e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg"
                        >
                          <option value="">-- Pilih label produk --</option>
                          <option value="Baru">Baru</option>
                          <option value="Populer">Populer</option>
                          <option value="Diskon">Diskon</option>
                          <option value="Hot Item">Hot Item</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="productCategory">Kategori</Label>
                        <Input
                          id="productCategory"
                          value={formData.category}
                          onChange={(e) => handleFieldChange('category', e.target.value)}
                          placeholder="Contoh: Script, Website, Bot"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <Label htmlFor="stockAvailable" className="mb-1">Stok Tersedia</Label>
                          <p className="text-sm text-slate-600">Tampilkan produk sebagai tersedia</p>
                        </div>
                        <Switch
                          id="stockAvailable"
                          checked={formData.stock_available}
                          onCheckedChange={(checked) => handleFieldChange('stock_available', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <Label htmlFor="showProduct" className="mb-1">Tampilkan Produk</Label>
                          <p className="text-sm text-slate-600">Tampilkan di halaman produk</p>
                        </div>
                        <Switch
                          id="showProduct"
                          checked={formData.show}
                          onCheckedChange={(checked) => handleFieldChange('show', checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="soldCount">Jumlah Terjual</Label>
                      <Input
                        id="soldCount"
                        type="number"
                        min="0"
                        value={formData.sold_count}
                        onChange={(e) => handleFieldChange('sold_count', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-blue-600" />
                      Gambar & File Produk
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-3">
                      <Label>Gambar Produk</Label>
                      {imagePreview ? (
                        <div className="relative">
                          <Image
                            src={imagePreview}
                            alt="Preview Gambar Produk"
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setImagePreview(null)
                              handleFieldChange('image', null)
                              handleFieldChange('imageUrl', '')
                            }}
                            className="absolute top-2 right-2"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Hapus Gambar
                          </Button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/10 transition-colors"
                        >
                          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                          <p className="text-slate-600 mb-0">Klik atau seret gambar ke sini</p>
                          <p className="text-slate-500 text-sm">Format: JPG, PNG (Maks. 5MB)</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    {/* Product File */}
                    <div className="space-y-3">
                      <Label>File Produk Digital</Label>
                      <div className="flex gap-2 mb-3">
                        <Button
                          type="button"
                          variant={fileSourceType === 'upload' ? 'default' : 'outline'}
                          onClick={() => setFileSourceType('upload')}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                        <Button
                          type="button"
                          variant={fileSourceType === 'url' ? 'default' : 'outline'}
                          onClick={() => setFileSourceType('url')}
                        >
                          Gunakan URL
                        </Button>
                      </div>

                      {fileSourceType === 'upload' && (
                        <>
                          {formData.file && typeof formData.file === 'object' ? (
                            <div className="p-3 border rounded bg-slate-50 mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-grow">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-grow min-w-0">
                                  <p className="text-sm font-medium text-slate-800 truncate">
                                    {(formData.file as File).name}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {formatFileSize((formData.file as File).size)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleFieldChange('file', null)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              onClick={() => productFileInputRef.current?.click()}
                              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/10 transition-colors"
                            >
                              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                              <p className="text-slate-600 mb-0">Klik atau seret file ke sini</p>
                              <p className="text-slate-500 text-sm">Format: ZIP, PDF, dll (Maks. 50MB)</p>
                            </div>
                          )}
                          <input
                            ref={productFileInputRef}
                            type="file"
                            onChange={handleProductFileChange}
                            className="hidden"
                          />
                        </>
                      )}

                      {fileSourceType === 'url' && (
                        <div className="space-y-2">
                          <Label htmlFor="fileUrl">Link File Produk</Label>
                          <Input
                            id="fileUrl"
                            type="url"
                            value={typeof formData.file === 'string' ? formData.file : ''}
                            onChange={(e) => handleFieldChange('file', e.target.value)}
                            placeholder="https://contoh.com/file-produk.zip"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Additional Info Tab */}
              <TabsContent value="info" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Informasi Tambahan
                    </CardTitle>
                    <p className="text-sm text-slate-600">
                      Tentukan informasi yang perlu diisi oleh pembeli saat melakukan pemesanan
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.additional_information.map((info, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <Label>Nama Label</Label>
                          <Input
                            value={info.name}
                            onChange={(e) => updateAdditionalInfo(index, 'name', e.target.value)}
                            placeholder="Contoh: ID Game, Username, dll"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label>Nilai Default (Opsional)</Label>
                          <Input
                            value={info.value}
                            onChange={(e) => updateAdditionalInfo(index, 'value', e.target.value)}
                            placeholder="Nilai default"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeAdditionalInfo(index)}
                            className="text-red-600 border-red-300 hover:bg-red-50 w-full"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAdditionalInfo}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Tambah Label Baru
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Error */}
            {error && (
              <Alert
                variant="danger"
                message={error}
                dismissible
                onClose={() => setError(null)}
              />
            )}

            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sticky bottom-0 p-4 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg">
              <div>
                {hasChanges && (
                  <p className="text-sm text-slate-600">
                    Anda memiliki perubahan yang belum disimpan
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus Produk
                    </>
                  )}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !hasChanges}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
