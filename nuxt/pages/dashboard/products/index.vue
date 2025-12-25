<template>
   <div class="container px-3 mb-4">
      <div class="content-card">
         <div class="card-header">
            <h5>Daftar Produk</h5>
            <NuxtLink to="/dashboard/add-product" class="btn btn-sm btn-custom-accent">
               <i class="bi bi-plus-lg me-1"></i> Tambah Baru
            </NuxtLink>
         </div>

         <div class="card-body">
            <div v-if="isLoading" class="text-center py-5">
               <div class="spinner-border product-loader-spinner" role="status"></div>
               <p class="mt-3">Memuat produk...</p>
            </div>

            <div class="content-card p-3 p-md-4" v-else-if="error">
               <div class="alert alert-danger">{{ error }}</div>
            </div>

            <div v-else>
               <div class="table-responsive">
                  <table class="table app-table align-middle">
                     <thead>
                        <tr>
                           <th scope="col">ID</th>
                           <th scope="col">Nama Produk</th>
                           <th scope="col">Harga</th>
                           <th scope="col">Terjual</th>
                           <th scope="col" class="text-center">Aksi</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="product in paginatedProducts" :key="product._id">
                           <td>{{ product._id }}</td>
                           <td>{{ product.name }}</td>
                           <td>{{ formatCurrency(product.price) }}</td>
                           <td>{{ product.sales }}x</td>
                           <td>
                              <div class="d-flex justify-content-center gap-2">
                                 <button class="btn btn-sm btn-action-view" title="Lihat"
                                    @click="actions.view(product._id)">
                                    <i class="bi bi-eye-fill"></i>
                                 </button>
                                 <button class="btn btn-sm btn-action-edit" title="Edit"
                                    @click="actions.edit(product._id)">
                                    <i class="bi bi-pencil-fill"></i>
                                 </button>
                                 <button class="btn btn-sm btn-action-delete" title="Hapus"
                                    @click="actions.delete(product._id, product.name)">
                                    <i class="bi bi-trash-fill"></i>
                                 </button>
                              </div>
                           </td>
                        </tr>
                        <tr v-if="paginatedProducts.length === 0">
                           <td :colspan="5" class="text-center text-muted py-4">
                              Tidak ada produk yang cocok dengan pencarian Anda.
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>

               <div class="card-footer">
                  <div class="search-container">
                     <i class="bi bi-search search-icon"></i>
                     <input type="search" v-model="searchQuery" class="form-control search-input"
                        placeholder="Cari produk...">
                  </div>

                  <nav v-if="totalPages > 1" class="pagination-container">
                     <ul class="pagination">
                        <li :class="['page-item', { disabled: currentPage === 1 }]">
                           <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">Prev</a>
                        </li>

                        <li class="page-item pagination-summary" aria-current="page">
                           <span class="page-link">{{ currentPage }} / {{ totalPages }}</span>
                        </li>

                        <li :class="['page-item', { disabled: currentPage === totalPages }]">
                           <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">Next</a>
                        </li>
                     </ul>
                  </nav>
               </div>
            </div>

         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const { $api } = useNuxtApp()

useHead({ title: 'Daftar Produk' })

interface Product {
   _id: string | number
   name: string
   price: number
   sales: number
}

const allProducts = ref<Product[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const filteredProducts = computed(() => {
   if (!searchQuery.value) return allProducts.value
   const lowerCaseQuery = searchQuery.value.toLowerCase()
   return allProducts.value.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery)
   )
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
   if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = 1
   }
   const startIndex = (currentPage.value - 1) * itemsPerPage.value
   const endIndex = startIndex + itemsPerPage.value
   return filteredProducts.value.slice(startIndex, endIndex)
})

const formatCurrency = (value: number) => {
   return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
   }).format(value)
}

const goToPage = (page: number) => {
   if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
   }
}

const actions = {
   view: (id: string | number) => router.push(`/product/${id}`),
   edit: (id: string | number) => router.push(`/dashboard/product/${id}`),
   delete: (id: string | number, name: string) => {
      Swal.fire({
         title: 'Anda Yakin?',
         text: `Produk "${name}" akan dihapus secara permanen!`,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#d33',
         cancelButtonColor: '#3085d6',
         confirmButtonText: 'Ya, hapus!',
         cancelButtonText: 'Batal'
      }).then(async (result) => {
         if (result.isConfirmed) {
            try {
               const response = await $api(`/api/v2/product/${id}`, {
                  method: 'DELETE'
               })

               if (!response.status) {
                  throw new Error(response.msg || 'Gagal menghapus produk.')
               }

               allProducts.value = allProducts.value.filter(p => p._id !== id)

               Swal.fire(
                  'Dihapus!',
                  'Produk telah berhasil dihapus.',
                  'success'
               )
            } catch (e: any) {
               Swal.fire(
                  'Gagal!',
                  e.message || 'Terjadi kesalahan saat mencoba menghapus produk.',
                  'error'
               )
            }
         }
      })
   }
}

onMounted(async () => {
   try {
      const response = await $api('/api/v2/products')
      if (!response.status) {
         error.value = response.msg
         return
      }
      allProducts.value = response.data
   } catch (e: any) {
      error.value = 'Gagal memuat data produk.'
   } finally {
      isLoading.value = false
   }
})
</script>