<template>
   <div>
      <main>
         <HeroSection />

         <section id="featured-products" class="container my-5">
            <h2 class="text-center fw-bold mb-5">Produk Unggulan</h2>

            <div v-if="pending" class="text-center">
               <p>Loading...</p>
            </div>

            <div v-else-if="error" class="alert alert-danger text-center">
               <p>Maaf, gagal memuat produk unggulan. Silakan coba lagi nanti.</p>
            </div>

            <div v-else-if="featuredProducts.length" class="row g-4">
               <div v-for="product in featuredProducts" :key="product.id" class="col-md-6 col-lg-3">
                  <ProductCard :product="product" />
               </div>
            </div>

            <div v-else class="text-center">
               <p>Saat ini belum ada produk unggulan.</p>
            </div>
         </section>
      </main>

      <AppFooter />
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { $api } = useNuxtApp()
useHead({ title: 'Beranda' })

const featuredProducts = ref([])
const pending = ref(true)
const error = ref(null)

// cache use: useAsyncData
onMounted(async () => {
   pending.value = true
   error.value = null
   try {
      const res = await $api('/api/v1/top-products')
      featuredProducts.value = res.data.map(product => ({
         id: product._id,
         name: product.name,
         price: product.price,
         imageUrl: product.imageUrl,
         sales: product.sales
      }))
   } catch (err) {
      error.value = 'Gagal memuat produk unggulan'
   } finally {
      pending.value = false
   }
})
</script>