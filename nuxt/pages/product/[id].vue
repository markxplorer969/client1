<template>
  <div class="product-detail-page">
    <div class="container px-3 py-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="loading-text">Memuat produk...</p>
      </div>

      <!-- Error State -->
      <Alert v-else-if="error" type="danger" class="error-alert">
        {{ error }}
      </Alert>

      <!-- Product Content -->
      <div class="row g-4" v-else-if="product">
        <!-- Product Image and Description -->
        <div class="col-lg-8">
          <div class="product-detail-card">
            <div class="product-image-container">
              <img 
                :src="product.imageUrl || 'https://via.placeholder.com/800x600.png?text=Gambar+Produk'"
                :alt="product.name" 
                class="product-image"
                loading="lazy"
              >
            </div>
            
            <div class="product-content">
              <h1 class="product-title">{{ product.name }}</h1>
              
              <div class="product-meta">
                <span class="last-updated">
                  <i class="bi bi-clock-history me-1"></i>
                  Terakhir diperbarui: {{ formatDate(product.updated_at) }}
                </span>
              </div>
              
              <div class="product-description" v-html="renderedDescription"></div>
            </div>
          </div>
        </div>

        <!-- Buy Card Sidebar -->
        <div class="col-lg-4">
          <div class="buy-card-wrapper">
            <BuyCard :product="product" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'

const { $api } = useNuxtApp()
const md = new MarkdownIt()

interface Product {
  _id: number | string
  name: string
  price: number
  original_price?: number
  description: string
  imageUrl?: string
  updated_at: string
}

const route = useRoute()
const id = route.params.id
const product = ref<Product | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const renderedDescription = computed(() => {
  if (product.value?.description) {
    return md.render(product.value.description)
  }
  return ''
})

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

onMounted(async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await $api(`/api/v1/products?id=${id}`)
    if (!response.status) throw new Error(response.msg)
    product.value = response.data
    useHead({ title: response.data.name })
  } catch (e: any) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.product-detail-page {
  background-color: #f8f9fa;
  min-height: calc(100vh - 120px);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
}

.spinner-grow {
  width: 3rem;
  height: 3rem;
}

.loading-text {
  font-size: 1.2rem;
  color: #6c757d;
}

/* Error State */
.error-alert {
  margin-top: 2rem;
}

/* Product Card */
.product-detail-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.product-image-container {
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f3f5;
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  max-height: 500px;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.02);
}

.product-content {
  padding: 2rem;
}

.product-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
}

.product-meta {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.product-meta i {
  font-size: 1rem;
}

.product-description {
  line-height: 1.7;
  color: #495057;
}

.product-description :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

.product-description :deep(a) {
  color: #0d6efd;
  text-decoration: none;
}

.product-description :deep(a:hover) {
  text-decoration: underline;
}

/* Buy Card Sidebar */
.buy-card-wrapper {
  position: sticky;
  top: 90px;
}

/* Responsive Design */
@media (max-width: 991.98px) {
  .product-content {
    padding: 1.5rem;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .buy-card-wrapper {
    position: static;
    margin-top: 2rem;
  }
}

@media (max-width: 575.98px) {
  .product-content {
    padding: 1.25rem;
  }
  
  .product-image-container {
    max-height: 300px;
  }
}
</style>