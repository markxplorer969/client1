<template>
   <!-- Loading State -->
   <div v-if="isLoading" class="d-flex flex-column justify-content-center align-items-center py-5">
      <div class="spinner-border product-loader-spinner text-primary mb-3" role="status"></div>
      <p class="mb-0 text-secondary">Sedang memuat produk...</p>
   </div>

   <!-- Error State -->
   <Alert v-else-if="error" type="danger">
      {{ error }}
   </Alert>

   <!-- Produk -->
   <div v-else-if="displayedProducts.length > 0">
      <div class="row row-cols-1 row-cols-md-2 g-4">
         <div 
            v-for="product in displayedProducts" 
            :key="product._id" 
            class="col product-card-wrapper"
         >
            <div class="content-card product-item-card position-relative h-100 d-flex flex-column">
               
               <!-- Badge -->
               <div v-if="product.label" class="product-badge">
                  {{ product.label }}
               </div>

               <!-- Gambar Produk -->
               <div class="product-image-wrapper">
                  <img 
                     :src="product.imageUrl || 'https://via.placeholder.com/400x400.png?text=Produk'" 
                     class="product-image"
                     :alt="product.name"
                  >
               </div>

               <!-- Konten Produk -->
               <div class="p-3 d-flex flex-column flex-grow-1">
                  <h5 class="mb-2 product-name">{{ product.name }}</h5>

                  <div class="d-flex align-items-baseline gap-2 mb-3">
                     <span class="product-price fw-bold">
                        {{ formatCurrencyV2(product.price) }}
                     </span>
                     <span 
                        v-if="product.original_price" 
                        class="original-price"
                     >
                        {{ formatCurrencyV2(product.original_price) }}
                     </span>
                  </div>

                  <p class="small text-secondary flex-grow-1 product-description">
                     {{ createExcerpt(product.description, 120) }}
                  </p>

                  <div class="mt-auto">
                     <button 
                        @click="viewDetails(product._id)" 
                        class="btn btn-custom-accent w-100"
                     >
                        Lihat Detail Produk
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- Infinite Scroll Loader -->
      <div v-if="hasMoreToShow" ref="loaderRef" class="text-center py-5">
         <div v-if="isShowingMore">
            <div class="spinner-border text-primary" role="status">
               <span class="visually-hidden">Loading...</span>
            </div>
         </div>
      </div>
   </div>

   <!-- Empty State -->
   <div v-else class="content-card text-center p-5 empty-state">
      <img src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png" alt="No products" class="mb-3" width="80">
      <p class="mb-0">Tidak ada produk yang dapat ditampilkan saat ini.</p>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from '#app'
import MarkdownIt from 'markdown-it'
import { formatCurrencyV2 } from '~/utils'

const md = new MarkdownIt()

interface Product {
   _id: number | string
   name: string
   price: number
   original_price?: number
   label?: 'Populer' | 'Baru' | string
   description: string
   imageUrl?: string
}

const { $api } = useNuxtApp()
const router = useRouter()

const allProducts = ref<Product[]>([])
const displayedProducts = ref<Product[]>([])
const isLoading = ref<boolean>(true)
const isShowingMore = ref<boolean>(false)
const error = ref<string | null>(null)
const hasMoreToShow = ref<boolean>(false)
const ITEMS_PER_BATCH = 4

const loaderRef = ref<Element | null>(null)
let observer: IntersectionObserver

const showNextBatch = () => {
   if (isShowingMore.value) return
   isShowingMore.value = true

   setTimeout(() => {
      const currentCount = displayedProducts.value.length
      const nextBatch = allProducts.value.slice(currentCount, currentCount + ITEMS_PER_BATCH)
      displayedProducts.value.push(...nextBatch)

      if (displayedProducts.value.length >= allProducts.value.length) {
         hasMoreToShow.value = false
      }

      isShowingMore.value = false
   }, 500)
}

const setupObserver = () => {
   observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
         showNextBatch()
      }
   }, { threshold: 0.1 })

   if (loaderRef.value) {
      observer.observe(loaderRef.value)
   }
}

const createExcerpt = (markdownContent: string, maxLength: number = 120): string => {
   if (!markdownContent) return ''
   const htmlContent = md.render(markdownContent)
   const plainText = htmlContent.replace(/<[^>]*>?/gm, '')
   if (plainText.length <= maxLength) return plainText
   const truncated = plainText.substring(0, maxLength)
   const lastSpaceIndex = truncated.lastIndexOf(' ')
   return (lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) : truncated) + '...'
}

const viewDetails = (productId: number | string) => {
   router.push(`/product/${productId}`)
}

onMounted(async () => {
   isLoading.value = true
   error.value = null
   try {
      const response = await $api('/api/v1/products')

      if (response && response.data) {
         allProducts.value = response.data
         displayedProducts.value = allProducts.value.slice(0, ITEMS_PER_BATCH)
         hasMoreToShow.value = allProducts.value.length > ITEMS_PER_BATCH
      } else {
         throw new Error(response.msg || 'Gagal mengambil data produk.')
      }
   } catch (e: any) {
      error.value = e.message || 'Terjadi kesalahan saat memuat produk.'
   } finally {
      isLoading.value = false
   }
})

watch(loaderRef, (newEl) => {
   if (newEl && hasMoreToShow.value) {
      setupObserver()
   }
})

onUnmounted(() => {
   if (observer) observer.disconnect()
})
</script>

<style scoped>
/* Produk Card */
.product-item-card {
   background: rgba(255, 255, 255, 0.04);
   border: 1px solid rgba(255, 255, 255, 0.08);
   border-radius: 16px;
   overflow: hidden;
   transition: all 0.35s ease;
}

.product-item-card:hover {
   transform: translateY(-4px);
   box-shadow: 0 8px 24px rgba(77, 171, 247, 0.15);
   border-color: var(--bs-primary);
}

/* Badge Produk */
.product-badge {
   position: absolute;
   top: 12px;
   left: 12px;
   background: linear-gradient(135deg, #4dabf7, #228be6);
   color: #fff;
   font-size: 0.8rem;
   font-weight: 600;
   padding: 4px 10px;
   border-radius: 6px;
   box-shadow: 0 2px 6px rgba(0,0,0,0.2);
   z-index: 2;
}

/* Gambar Produk */
.product-image-wrapper {
   width: 100%;
   overflow: hidden;
}

.product-image {
   width: 100%;
   height: 250px;
   object-fit: cover;
   transition: transform 0.4s ease;
}

.product-item-card:hover .product-image {
   transform: scale(1.05);
}

/* Nama Produk */
.product-name {
   font-size: 1.05rem;
   font-weight: 600;
   color: var(--bs-light);
}

/* Harga */
.product-price {
   font-size: 1rem;
   color: var(--bs-primary);
}

.original-price {
   font-size: 0.9rem;
   text-decoration: line-through;
   opacity: 0.6;
}

/* Empty State */
.empty-state {
   border-radius: 16px;
   background: rgba(255,255,255,0.03);
}
</style>
