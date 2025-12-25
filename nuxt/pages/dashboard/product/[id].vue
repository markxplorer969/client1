<template>
   <div class="container px-3 mb-4">
      <div v-if="isFetching" class="d-flex justify-content-center align-items-center py-5">
         <div class="spinner-border product-loader-spinner" role="status"></div>
         <p class="ms-3 mb-0">Loading...</p>
      </div>

      <div v-else-if="productData._id" class="content-card p-3 p-md-4">
         <form @submit.prevent="handleSubmit">
            <div class="row g-4">
               <div class="col-md-7">
                  <div class="mb-3"><label for="productName" class="form-label">Nama Produk</label><input type="text"
                        class="form-control" id="productName" v-model="productData.name" required></div>
                  <div class="mb-3"><label for="productDescription" class="form-label">Deskripsi (Markdown)</label>
                     <div class="editor-toolbar"><button type="button" @click="formatText('bold')"
                           title="Bold (Ctrl+B)"><i class="bi bi-type-bold"></i></button><button type="button"
                           @click="formatText('italic')" title="Italic (Ctrl+I)"><i
                              class="bi bi-type-italic"></i></button><button type="button"
                           @click="formatText('heading')" title="Heading"><i class="bi bi-type-h2"></i></button><button
                           type="button" @click="formatText('list')" title="Unordered List"><i
                              class="bi bi-list-ul"></i></button></div><textarea class="form-control editor-textarea"
                        id="productDescription" rows="8" v-model="productData.description" ref="descriptionTextarea"
                        required></textarea>
                  </div>
                  <div class="row">
                     <div class="col-sm-6 mb-3"><label for="productPrice" class="form-label">Harga</label><input
                           type="number" class="form-control" id="productPrice" v-model="productData.price" required>
                     </div>
                     <div class="col-sm-6 mb-3"><label for="original_price" class="form-label">Harga Asli
                           (Opsional)</label><input type="number" class="form-control" id="original_price"
                           v-model="productData.original_price" placeholder="Contoh: 500000"></div>
                     <div class="col-sm-6 mb-3"><label for="productTag" class="form-label">Tag (Opsional)</label><select
                           class="form-select" id="productTag" v-model="productData.label">
                           <option value="">-- Tidak ada tag --</option>
                           <option value="Baru">Baru</option>
                           <option value="Populer">Populer</option>
                           <option value="Diskon">Diskon</option>
                        </select></div>
                     <div class="col-sm-6 mb-3"><label for="productVisibility"
                           class="form-label">Visibilitas</label><select class="form-select" id="productVisibility"
                           v-model="productData.show">
                           <option value="true">Tampilkan</option>
                           <option value="false">Sembunyikan</option>
                        </select></div>
                  </div>
                  <div class="mb-3"><label class="form-label d-block">Ketersediaan Stok</label>
                     <div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch"
                           id="stockSwitch" v-model="productData.stock_available"><label class="form-check-label"
                           for="stockSwitch">{{ productData.stock_available ? 'Stok Tersedia' : 'Stok Habis'
                           }}</label></div>
                  </div>
               </div>
               <div class="col-md-5 d-flex flex-column">
                  <label class="form-label">Gambar Produk</label>
                  <div v-if="imagePreviewUrl" class="image-preview-container mb-2"><img :src="imagePreviewUrl"
                        alt="Preview Gambar Produk" class="img-preview"></div>
                  <div class="image-upload-box text-center" @click="triggerImageFileInput" @dragover.prevent
                     @drop.prevent="handleImageFileDrop">
                     <div v-if="productData.image || imagePreviewUrl"><i
                           class="bi bi-file-earmark-image-fill upload-icon text-success"></i>
                        <p class="mb-0 text-truncate px-2" :title="productData.image?.name">{{ productData.image?.name
                           ||
                           'Gambar saat ini' }}</p><button type="button" class="btn btn-sm btn-outline-danger mt-2"
                           @click.stop="removeImage">Ganti Gambar</button>
                     </div>
                     <div v-else><i class="bi bi-cloud-arrow-up-fill upload-icon"></i>
                        <p class="text-secondary small">Klik atau seret gambar baru</p>
                     </div>
                  </div>
                  <input type="file" ref="imageFileInput" @change="handleImageFileChange" accept="image/*"
                     class="d-none">
               </div>
            </div>

            <hr class="my-4">

            <div class="mb-4">
               <h5 class="mb-3">File Produk (Opsional)</h5>
               <ul class="nav nav-tabs mb-3">
                  <li class="nav-item"><button class="nav-link" :class="{ active: fileSourceType === 'upload' }"
                        type="button" @click="setFileSourceType('upload')">Upload File</button></li>
                  <li class="nav-item"><button class="nav-link" :class="{ active: fileSourceType === 'url' }"
                        type="button" @click="setFileSourceType('url')">Gunakan URL</button></li>
               </ul>
               <div class="tab-content border-0">
                  <div v-if="fileSourceType === 'upload'">
                     <div class="mb-3">
                        <label class="form-label small">Tujuan Upload : &nbsp;</label>
                        <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                              id="uploadLocal" value="local" v-model="uploadDestination"><label class="form-check-label"
                              for="uploadLocal">Local</label></div>
                        <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                              id="uploadCloud" value="cloud" v-model="uploadDestination"><label class="form-check-label"
                              for="uploadCloud">Cloud</label></div>
                     </div>
                     <div class="image-upload-box text-center" @click="triggerProductFileInput">
                        <div v-if="newFileObject"><i class="bi bi-file-zip-fill upload-icon text-success"></i>
                           <p class="mb-0 text-truncate px-2" :title="newFileObject.name">{{ newFileObject.name }}</p>
                           <button type="button" class="btn btn-sm btn-outline-danger mt-2"
                              @click.stop="removeProductFile">Ganti File</button>
                        </div>
                        <div v-else-if="existingFile"><i
                              class="bi bi-file-earmark-check-fill upload-icon text-success"></i>
                           <p class="mb-0 text-truncate px-2" :title="existingFile.data">File saat ini: {{
                              existingFile.data.split('/').pop() }}</p>
                           <p class="small text-muted mb-0">({{ existingFile.size }})</p><button type="button"
                              class="btn btn-sm btn-outline-danger mt-2" @click.stop="removeProductFile">Hapus
                              File</button>
                        </div>
                        <div v-else><i class="bi bi-cloud-arrow-up-fill upload-icon"></i>
                           <p class="text-secondary small">Klik atau seret file</p>
                        </div>
                     </div>
                     <input type="file" ref="productFileInput" @change="handleProductFileChange" class="d-none">
                  </div>
                  <div v-if="fileSourceType === 'url'">
                     <label for="fileUrl" class="form-label">Link File Produk</label>
                     <input type="url" class="form-control" id="fileUrl" v-model="fileUrlInput"
                        placeholder="https://contoh.com/file.zip">
                  </div>
               </div>
            </div>

            <hr class="my-4">

            <div class="mb-4">
               <h5 class="mb-3">Informasi Tambahan dari Pembeli</h5>
               <p class="small">Tentukan label input yang harus diisi oleh pembeli saat checkout.</p>
               <div v-for="(info, index) in productData.additional_information" :key="index"
                  class="row g-2 mb-2 align-items-center">
                  <div class="col"><input type="text" class="form-control" v-model="info.name"
                        placeholder="Nama Label (Contoh: ID Game)"></div>
                  <div class="col-auto"><button type="button" class="btn btn-sm btn-outline-danger"
                        @click="removeInfo(index)" title="Hapus Label"><i class="bi bi-trash"></i></button></div>
               </div>
               <button type="button" class="btn btn-sm btn-outline-secondary" @click="addInfo"><i
                     class="bi bi-plus-circle"></i> Tambah Label</button>
            </div>

            <div class="d-flex justify-content-end">
               <button type="submit" class="btn btn-custom-accent btn-lg" :disabled="isSubmitting"><span
                     v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                     aria-hidden="true"></span><span v-else>Update Produk</span></button>
            </div>
         </form>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const { $api } = useNuxtApp()
useHead({ title: 'Edit Produk' })

interface AdditionalInfo {
   name: string
}

interface FileObject {
   type: 'local' | 'cloud'
   size: string | null
   bytes: number | null
   mime: string | null
   extension: string | null
   data: string
}

interface ProductFormData {
   _id: string
   name: string
   description: string
   price: number | null
   original_price: number | null
   label: string
   image: File | null
   show: string
   additional_information: AdditionalInfo[]
   stock_available: boolean
   file: FileObject | null
}

const productData = reactive<Partial<ProductFormData>>({
   additional_information: []
})

const isFetching = ref(true)
const isSubmitting = ref(false)
const imagePreviewUrl = ref<string | null>(null)
const imageFileInput = ref<HTMLInputElement | null>(null)
const descriptionTextarea = ref<HTMLTextAreaElement | null>(null)

const existingFile = ref<FileObject | null>(null)
const newFileObject = ref<File | null>(null)
const fileUrlInput = ref('')
const fileSourceType = ref('upload')
const uploadDestination = ref('local')
const productFileInput = ref<HTMLInputElement | null>(null)

const route = useRoute()
const router = useRouter()
const productId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

const addInfo = () => productData.additional_information?.push({ name: '' })
const removeInfo = (index: number) => productData.additional_information?.splice(index, 1)
const triggerImageFileInput = () => imageFileInput.value?.click()
const processImageFile = (file: File | null) => { if (file && file.type.startsWith('image/')) { productData.image = file; imagePreviewUrl.value = URL.createObjectURL(file) } }
const handleImageFileChange = (event: Event) => processImageFile((event.target as HTMLInputElement).files?.[0] || null)
const handleImageFileDrop = (event: DragEvent) => processImageFile(event.dataTransfer?.files[0] || null)
const removeImage = () => { productData.image = null; imagePreviewUrl.value = null; if (imageFileInput.value) imageFileInput.value.value = '' }
const setFileSourceType = (type: 'upload' | 'url') => fileSourceType.value = type
const triggerProductFileInput = () => productFileInput.value?.click()
const handleProductFileChange = (event: Event) => { const file = (event.target as HTMLInputElement).files?.[0] || null; if (file) { newFileObject.value = file; existingFile.value = null; fileUrlInput.value = '' } }
const removeProductFile = () => { newFileObject.value = null; existingFile.value = null; fileUrlInput.value = ''; if (productFileInput.value) productFileInput.value.value = '' }
const formatText = (type: 'bold' | 'italic' | 'heading' | 'list') => { const textarea = descriptionTextarea.value; if (!textarea) return; const start = textarea.selectionStart; const end = textarea.selectionEnd; const selectedText = textarea.value.substring(start, end); let replacement = ''; switch (type) { case 'bold': replacement = `**${selectedText}**`; break; case 'italic': replacement = `*${selectedText}*`; break; case 'heading': const startOfLine = textarea.value.lastIndexOf('\n', start - 1) + 1; const lineText = textarea.value.substring(startOfLine, end); replacement = `## ${lineText}`; textarea.setSelectionRange(startOfLine, end); break; case 'list': const lines = selectedText.split('\n'); replacement = lines.map(line => `- ${line}`).join('\n'); break; }; textarea.setRangeText(replacement, textarea.selectionStart, textarea.selectionEnd, 'end'); productData.description = textarea.value; textarea.focus() }

onMounted(async () => {
   try {
      const response = await $api(`/api/v2/products?id=${productId}`)
      if (!response.status) throw new Error(response.msg)

      const fetchedData = response.data
      Object.assign(productData, fetchedData)
      productData.show = String(fetchedData.show)
      imagePreviewUrl.value = fetchedData.imageUrl

      if (fetchedData.file) {
         existingFile.value = fetchedData.file
         if (fetchedData.file.type === 'cloud') {
            fileSourceType.value = 'url'
            fileUrlInput.value = fetchedData.file.data
         } else {
            fileSourceType.value = 'upload'
         }
      }

      if (fetchedData.additional_information && typeof fetchedData.additional_information === 'string') {
         try { productData.additional_information = JSON.parse(fetchedData.additional_information) } catch (e) { productData.additional_information = [] }
      } else if (!fetchedData.additional_information) {
         productData.additional_information = []
      }

   } catch (e: any) {
      await Swal.fire({ icon: 'error', title: 'Gagal Memuat Data', text: e.message || 'Tidak dapat mengambil data produk.', confirmButtonText: 'Kembali' }).then(() => { router.push('/dashboard') })
   } finally {
      isFetching.value = false
   }
})


const handleSubmit = async () => {
   isSubmitting.value = true
   if (!productData.name || !productData.price) {
      Swal.fire('Input Tidak Lengkap', 'Nama dan harga produk wajib diisi.', 'warning')
      isSubmitting.value = false
      return
   }

   const formData = new FormData()

   formData.append('id', productId)
   formData.append('type', 'edit')
   formData.append('name', productData.name!)
   formData.append('description', productData.description || '')
   formData.append('price', String(productData.price))
   formData.append('original_price', String(productData.original_price || ''))
   formData.append('label', productData.label || '')
   formData.append('show', productData.show!)
   formData.append('stock_available', String(productData.stock_available))

   const validInfo = productData.additional_information?.filter(info => info.name.trim()) || []
   formData.append('additional_information', JSON.stringify(validInfo))

   if (productData.image) {
      formData.append('image', productData.image)
   }

   if (newFileObject.value) {
      formData.append('file', newFileObject.value)
      formData.append('file_upload_destination', uploadDestination.value)
   } else if (fileSourceType.value === 'url') {
      if (fileUrlInput.value !== existingFile.value?.data) {
         formData.append('file_url', fileUrlInput.value)
      }
   } else if (!existingFile.value) {
      formData.append('file', '')
   }

   try {
      const response = await $api('/api/v2/product', { method: 'POST', body: formData })
      if (!response.status) throw new Error(response.msg)
      await Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Produk telah diperbarui.', timer: 2000, showConfirmButton: false })
   } catch (e: any) {
      Swal.fire({ icon: 'error', title: 'Update Gagal', text: `Terjadi kesalahan: ${e.message}` })
   } finally {
      isSubmitting.value = false
   }
}
</script>