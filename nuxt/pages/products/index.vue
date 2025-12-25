<template>
  <div class="product-page-container">
    <div class="container px-3 py-4">
      <div class="row g-4">

        <!-- Product List Column -->
        <div class="col-lg-8">
          <div class="product-list-container">
            <ProductList />
          </div>
        </div>

        <!-- FAQ Sidebar Column -->
        <div class="col-lg-4 faq-sidebar">
          <div class="faq-container">
            <FaqSection />
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Daftar Produk' })
</script>

<style scoped>
.product-page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.container {
  flex: 1;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.product-list-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.faq-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

@media (min-width: 992px) {
  .faq-sidebar {
    position: -webkit-sticky;
    position: sticky;
    top: 90px;
    align-self: flex-start;
    transition: all 0.3s ease;
  }

  .faq-sidebar:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .product-list-container,
  .faq-container {
    margin-bottom: 1.5rem;
  }
}
</style>