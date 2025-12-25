<template>
   <div class="container px-3 mb-5">
      <div class="content-card p-4 p-md-5 shadow-sm">
         <div class="d-flex align-items-center mb-4">
            <h2 class="h3 mb-0 flex-grow-1">Tambah Produk Baru</h2>
            <button type="button" class="btn btn-outline-secondary me-2" @click="$router.back()">
               <i class="bi bi-arrow-left me-1"></i> Kembali
            </button>
         </div>
         
         <form @submit.prevent="handleSubmit">
            <div class="row g-5">
               <!-- Bagian Kiri: Informasi Utama -->
               <div class="col-lg-8">
                  <div class="card border-0 shadow-sm mb-4">
                     <div class="card-header bg-light py-3">
                        <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Informasi Produk</h5>
                     </div>
                     <div class="card-body">
                        <div class="mb-4">
                           <label for="productName" class="form-label fw-semibold">Nama Produk</label>
                           <input type="text" class="form-control form-control-lg" id="productName" 
                                  v-model="productData.name" placeholder="Masukkan nama produk" required>
                        </div>
                        
                        <div class="mb-4">
                           <label for="productDescription" class="form-label fw-semibold">Deskripsi Produk</label>
                           <div class="card border-0 bg-light">
                              <div class="card-header py-2">
                                 <div class="editor-toolbar d-flex gap-2 flex-wrap">
                                    <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('bold')" title="Bold (Ctrl+B)">
                                       <i class="bi bi-type-bold"></i>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('italic')" title="Italic (Ctrl+I)">
                                       <i class="bi bi-type-italic"></i>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('heading')" title="Heading">
                                       <i class="bi bi-type-h2"></i>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary" @click="formatText('list')" title="Unordered List">
                                       <i class="bi bi-list-ul"></i>
                                    </button>
                                    <div class="ms-auto small text-muted d-none d-md-block">Gunakan Markdown untuk format teks</div>
                                 </div>
                              </div>
                              <div class="card-body p-0">
                                 <textarea class="form-control editor-textarea border-0" id="productDescription" 
                                           rows="8" v-model="productData.description" ref="descriptionTextarea"
                                           placeholder="Deskripsi produk menggunakan format Markdown..."></textarea>
                              </div>
                           </div>
                        </div>
                        
                        <div class="row">
                           <div class="col-md-6 mb-3">
                              <label for="productPrice" class="form-label fw-semibold">Harga Jual</label>
                              <div class="input-group">
                                 <span class="input-group-text">Rp</span>
                                 <input type="number" class="form-control" id="productPrice" 
                                        v-model="productData.price" min="0" required>
                              </div>
                           </div>
                           <div class="col-md-6 mb-3">
                              <label for="originalPrice" class="form-label fw-semibold">Harga Asli <span class="text-muted">(Opsional)</span></label>
                              <div class="input-group">
                                 <span class="input-group-text">Rp</span>
                                 <input type="number" class="form-control" id="originalPrice" 
                                        v-model="productData.originalPrice" min="0" placeholder="Contoh: 500000">
                              </div>
                              <div class="form-text">Harga asli akan ditampilkan sebagai harga coret jika diisi</div>
                           </div>
                        </div>
                        
                        <div class="mb-3">
                           <label for="productBadge" class="form-label fw-semibold">Label Produk <span class="text-muted">(Opsional)</span></label>
                           <select class="form-select" id="productBadge" v-model="productData.badge">
                              <option value="">-- Pilih label produk --</option>
                              <option value="Baru">Baru</option>
                              <option value="Populer">Populer</option>
                              <option value="Diskon">Diskon</option>
                              <option value="Hot Item">Hot Item</option>
                           </select>
                        </div>
                     </div>
                  </div>
                  
                  <div class="card border-0 shadow-sm mb-4">
                     <div class="card-header bg-light py-3">
                        <h5 class="mb-0"><i class="bi bi-info-square me-2"></i>Informasi Tambahan dari Pembeli</h5>
                     </div>
                     <div class="card-body">
                        <p class="text-muted small">Tentukan informasi yang perlu diisi oleh pembeli saat melakukan pemesanan.</p>
                        
                        <div v-for="(info, index) in productData.additional_information" :key="index" 
                             class="row g-2 mb-3 align-items-center">
                           <div class="col">
                              <input type="text" class="form-control" v-model="info.name" 
                                     placeholder="Nama Label (Contoh: ID Game, Username, dll)">
                           </div>
                           <div class="col-auto">
                              <button type="button" class="btn btn-sm btn-outline-danger" 
                                      @click="removeInfo(index)" title="Hapus Label">
                                 <i class="bi bi-trash"></i>
                              </button>
                           </div>
                        </div>
                        
                        <button type="button" class="btn btn-outline-primary btn-sm" @click="addInfo">
                           <i class="bi bi-plus-circle me-1"></i> Tambah Label
                        </button>
                     </div>
                  </div>
               </div>
               
               <!-- Bagian Kanan: Upload Gambar & File -->
               <div class="col-lg-4">
                  <div class="card border-0 shadow-sm mb-4">
                     <div class="card-header bg-light py-3">
                        <h5 class="mb-0"><i class="bi bi-image me-2"></i>Gambar Produk</h5>
                     </div>
                     <div class="card-body">
                        <div v-if="imagePreviewUrl" class="image-preview-container mb-3 text-center">
                           <img :src="imagePreviewUrl" alt="Preview Gambar Produk" class="img-preview rounded shadow-sm">
                           <button type="button" class="btn btn-sm btn-danger mt-2 w-100" @click="removeImage">
                              <i class="bi bi-trash me-1"></i> Hapus Gambar
                           </button>
                        </div>
                        <div v-else class="image-upload-box text-center p-4 border rounded bg-light" 
                             @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
                           <i class="bi bi-cloud-arrow-up display-5 text-muted mb-2"></i>
                           <p class="text-muted small mb-0">Klik atau seret gambar ke sini</p>
                           <p class="text-muted small">Format: JPG, PNG (Maks. 5MB)</p>
                        </div>
                        <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="d-none">
                     </div>
                  </div>
                  
                  <div class="card border-0 shadow-sm">
                     <div class="card-header bg-light py-3">
                        <h5 class="mb-0"><i class="bi bi-file-earmark me-2"></i>File Produk</h5>
                     </div>
                     <div class="card-body">
                        <p class="text-muted small mb-3">Sediakan file digital yang akan diterima pembeli.</p>
                        
                        <ul class="nav nav-pills mb-3">
                           <li class="nav-item me-2">
                              <button class="nav-link" :class="{ active: fileSourceType === 'upload' }" 
                                      type="button" @click="setFileSourceType('upload')">
                                 <i class="bi bi-upload me-1"></i> Upload File
                              </button>
                           </li>
                           <li class="nav-item">
                              <button class="nav-link" :class="{ active: fileSourceType === 'url' }" 
                                      type="button" @click="setFileSourceType('url')">
                                 <i class="bi bi-link-45deg me-1"></i> Gunakan URL
                              </button>
                           </li>
                        </ul>
                        
                        <div v-if="fileSourceType === 'upload'">
                           <div class="mb-3">
                              <label class="form-label small fw-semibold">Tujuan Upload</label>
                              <div class="d-flex gap-3">
                                 <div class="form-check">
                                    <input class="form-check-input" type="radio" id="uploadLocal" 
                                           value="local" v-model="uploadDestination">
                                    <label class="form-check-label small" for="uploadLocal">Local</label>
                                 </div>
                                 <div class="form-check">
                                    <input class="form-check-input" type="radio" id="uploadCloud" 
                                           value="cloud" v-model="uploadDestination">
                                    <label class="form-check-label small" for="uploadCloud">Cloud</label>
                                 </div>
                              </div>
                           </div>
                           
                           <div v-if="productData.file && typeof productData.file === 'object'" 
                                class="file-preview p-3 border rounded bg-light mb-3">
                              <div class="d-flex align-items-center">
                                 <i class="bi bi-file-earmark-zip-fill text-primary fs-4 me-2"></i>
                                 <div class="flex-grow-1 text-truncate">
                                    <p class="mb-0 small fw-medium text-truncate" :title="productData.file.name">
                                       {{ productData.file.name }}
                                    </p>
                                    <p class="mb-0 small text-muted">
                                       {{ formatFileSize(productData.file.size) }}
                                    </p>
                                 </div>
                                 <button type="button" class="btn btn-sm btn-outline-danger ms-2" 
                                         @click="removeProductFile" title="Hapus File">
                                    <i class="bi bi-trash"></i>
                                 </button>
                              </div>
                           </div>
                           <div v-else class="file-upload-box text-center p-4 border rounded bg-light" 
                                @click="triggerProductFileInput">
                              <i class="bi bi-cloud-arrow-up text-muted display-6 mb-2"></i>
                              <p class="text-muted small mb-0">Klik atau seret file ke sini</p>
                              <p class="text-muted small">Format: ZIP, PDF, dll (Maks. 50MB)</p>
                           </div>
                           <input type="file" ref="productFileInput" @change="handleProductFileChange" class="d-none">
                        </div>
                        
                        <div v-if="fileSourceType === 'url'">
                           <label for="fileUrl" class="form-label small fw-semibold">Link File Produk</label>
                           <input type="url" class="form-control" id="fileUrl" v-model="productData.file" 
                                  placeholder="https://contoh.com/file-produk.zip">
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            <div class="sticky-bottom-bar py-4 mt-5 bg-light rounded">
               <div class="d-flex justify-content-between align-items-center">
                  <div class="text-muted small" v-if="!isFormValid">
                     Harap isi semua field yang wajib diisi
                  </div>
                  <div v-else></div>
                  <button type="submit" class="btn btn-primary btn-lg px-4" :disabled="isLoading">
                     <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                     <span v-else><i class="bi bi-check-circle me-2"></i></span>
                     {{ isLoading ? 'Menyimpan...' : 'Simpan Produk' }}
                  </button>
               </div>
            </div>
            
            <div v-if="error" class="alert alert-danger mt-4 d-flex align-items-center" role="alert">
               <i class="bi bi-exclamation-triangle-fill me-2"></i>
               <div>{{ error }}</div>
            </div>
         </form>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'

interface AdditionalInfo { name: string }

interface ProductFormData {
   name: string
   description: string
   price: number | null
   originalPrice: number | null
   badge: string
   image: File | null
   additional_information: AdditionalInfo[]
   file: File | string | null
}

const productData = reactive<ProductFormData>({
   name: '',
   description: '',
   price: null,
   originalPrice: null,
   badge: '',
   image: null,
   additional_information: [],
   file: null
})

const fileSourceType = ref('upload')
const uploadDestination = ref('local')
const productFileInput = ref<HTMLInputElement | null>(null)

const isLoading = ref(false)
const error = ref<string | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const descriptionTextarea = ref<HTMLTextAreaElement | null>(null)
const router = useRouter()
const { $api } = useNuxtApp()

// Computed property untuk memeriksa kelengkapan form
const isFormValid = computed(() => {
   return productData.name && productData.price && productData.image
})

// Format ukuran file untuk ditampilkan
const formatFileSize = (bytes: number) => {
   if (bytes === 0) return '0 Bytes'
   const k = 1024
   const sizes = ['Bytes', 'KB', 'MB', 'GB']
   const i = Math.floor(Math.log(bytes) / Math.log(k))
   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const setFileSourceType = (type: 'upload' | 'url') => {
   fileSourceType.value = type
   productData.file = null
   removeProductFile()
}

const triggerProductFileInput = () => productFileInput.value?.click()

const handleProductFileChange = (event: Event) => {
   const target = event.target as HTMLInputElement
   const file = target.files?.[0] || null
   if (file) {
      // Validasi ukuran file (maksimal 50MB)
      if (file.size > 50 * 1024 * 1024) {
         Swal.fire({
            icon: 'error',
            title: 'File terlalu besar',
            text: 'Ukuran file maksimal adalah 50MB'
         })
         return
      }
      productData.file = file
   }
}

const removeProductFile = () => {
   productData.file = null
   if (productFileInput.value) {
      productFileInput.value.value = ''
   }
}

const addInfo = () => productData.additional_information.push({ name: '' })
const removeInfo = (index: number) => productData.additional_information.splice(index, 1)
const triggerFileInput = () => fileInput.value?.click()

const processFile = (file: File | null) => {
   if (file && file.type.startsWith('image/')) {
      // Validasi ukuran gambar (maksimal 5MB)
      if (file.size > 5 * 1024 * 1024) {
         Swal.fire({
            icon: 'error',
            title: 'Gambar terlalu besar',
            text: 'Ukuran gambar maksimal adalah 5MB'
         })
         return
      }
      productData.image = file
      imagePreviewUrl.value = URL.createObjectURL(file)
   }
}

const handleFileChange = (event: Event) => processFile((event.target as HTMLInputElement).files?.[0] || null)
const handleFileDrop = (event: DragEvent) => processFile(event.dataTransfer?.files[0] || null)

const removeImage = () => {
   productData.image = null
   if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value)
   imagePreviewUrl.value = null
   if (fileInput.value) fileInput.value.value = ''
}

const formatText = (type: 'bold' | 'italic' | 'heading' | 'list') => {
   const textarea = descriptionTextarea.value
   if (!textarea) return
   
   const start = textarea.selectionStart
   const end = textarea.selectionEnd
   const selectedText = textarea.value.substring(start, end)
   let replacement = ''
   
   switch (type) {
      case 'bold': 
         replacement = `**${selectedText}**`
         break
      case 'italic': 
         replacement = `*${selectedText}*`
         break
      case 'heading': 
         const startOfLine = textarea.value.lastIndexOf('\n', start - 1) + 1
         const lineText = textarea.value.substring(startOfLine, end)
         replacement = `## ${lineText}`
         textarea.setSelectionRange(startOfLine, end)
         break
      case 'list': 
         const lines = selectedText.split('\n')
         replacement = lines.map(line => `- ${line}`).join('\n')
         break
   }
   
   textarea.setRangeText(replacement, textarea.selectionStart, textarea.selectionEnd, 'end')
   productData.description = textarea.value
   textarea.focus()
}

const handleSubmit = async () => {
   isLoading.value = true
   error.value = null
   
   if (!productData.name || !productData.price || !productData.image) {
      error.value = "Nama, harga, dan gambar produk wajib diisi."
      isLoading.value = false
      
      // Scroll ke atas untuk melihat pesan error
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
   }

   const formData = new FormData()
   formData.append('name', productData.name)
   formData.append('description', productData.description)
   formData.append('price', String(productData.price))
   
   if (productData.originalPrice) formData.append('original_price', String(productData.originalPrice))
   if (productData.badge) formData.append('badge', productData.badge)
   formData.append('image', productData.image)
   formData.append('type', 'add')

   const validInfo = productData.additional_information.filter(info => info.name.trim())
   if (validInfo.length > 0) {
      formData.append('additional_information', JSON.stringify(validInfo))
   }

   if (productData.file) {
      if (fileSourceType.value === 'upload' && typeof productData.file === 'object') {
         formData.append('file', productData.file)
         formData.append('file_upload_destination', uploadDestination.value)
      } else if (fileSourceType.value === 'url' && typeof productData.file === 'string') {
         formData.append('file_url', productData.file)
      }
   }

   try {
      const response = await $api('/api/v2/product', { method: 'POST', body: formData })
      
      // Reset form
      Object.assign(productData, { 
         name: '', 
         description: '', 
         price: null, 
         originalPrice: null, 
         badge: '', 
         image: null, 
         additional_information: [], 
         file: null 
      })
      removeImage()
      removeProductFile()
      
      if (!response.data?._id) throw new Error(response.msg)
      
      await Swal.fire({ 
         icon: 'success', 
         title: 'Berhasil!', 
         text: 'Produk telah ditambahkan.', 
         timer: 2000, 
         showConfirmButton: false 
      })
      
      // Redirect ke halaman produk atau tetap di form untuk menambah produk baru
      router.push('/products')
      
   } catch (e: any) {
      error.value = e.data?.msg || "Gagal menambahkan produk. Silakan coba lagi."
      Swal.fire({ 
         icon: 'error', 
         title: 'Gagal', 
         text: `Terjadi kesalahan: ${e.message}` 
      })
   } finally {
      isLoading.value = false
   }
}
</script>

<style scoped>
.content-card {
   background-color: #fff;
   border-radius: 12px;
}

.card {
   border-radius: 10px;
   overflow: hidden;
}

.card-header {
   border-bottom: 1px solid rgba(0,0,0,0.05);
}

.form-control, .form-select {
   border-radius: 8px;
   padding: 12px 16px;
}

.form-control:focus, .form-select:focus {
   box-shadow: 0 0 0 3px rgba(13,110,253,0.15);
}

.editor-toolbar {
   padding: 8px 12px;
   background-color: #f8f9fa;
   border-radius: 8px 8px 0 0;
}

.editor-textarea {
   min-height: 200px;
   border-radius: 0 0 8px 8px;
   resize: vertical;
}

.image-upload-box, .file-upload-box {
   border: 2px dashed #dee2e6;
   border-radius: 10px;
   cursor: pointer;
   transition: all 0.2s ease;
}

.image-upload-box:hover, .file-upload-box:hover {
   border-color: #0d6efd;
   background-color: #f8f9fa;
}

.upload-icon {
   font-size: 2rem;
}

.img-preview {
   max-width: 100%;
   max-height: 300px;
   object-fit: contain;
}

.nav-pills .nav-link {
   border-radius: 6px;
}

.nav-pills .nav-link.active {
   background-color: #0d6efd;
}

.sticky-bottom-bar {
   position: sticky;
   bottom: 20px;
   box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
   z-index: 100;
}

.btn {
   border-radius: 8px;
   padding: 10px 20px;
   font-weight: 500;
}

.btn-lg {
   padding: 12px 24px;
}

.spinner-border {
   width: 1.2rem;
   height: 1.2rem;
}

.badge {
   font-size: 0.8em;
   padding: 5px 10px;
   border-radius: 20px;
}

.input-group-text {
   background-color: #f8f9fa;
}

.file-preview {
   border-radius: 8px;
}

@media (max-width: 768px) {
   .content-card {
      padding: 1.5rem;
   }
   
   .sticky-bottom-bar {
      position: relative;
      bottom: 0;
      margin-top: 2rem;
   }
}
</style>