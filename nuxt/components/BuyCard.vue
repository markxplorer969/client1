<template>
  <div class="buy-card">
    <!-- Price Section -->
    <div class="price-section">
      <h3 class="current-price">{{ formatCurrencyV2(product.price) }}</h3>
      <span v-if="product.original_price" class="original-price">
        {{ formatCurrencyV2(product.original_price) }}
      </span>
    </div>

    <!-- Purchase Form -->
    <form id="purchase-form" @submit.prevent="handleBuy(product._id)">
      <!-- Additional Information Fields -->
      <div v-if="purchaseFormData.length" class="additional-info">
        <h4>Lengkapi Data Pesanan</h4>
        <div v-for="(info, index) in purchaseFormData" :key="index" class="info-field">
          <label :for="`info-${index}`">{{ info.name }}</label>
          <input
            type="text"
            :id="`info-${index}`"
            v-model="info.value"
            :placeholder="`Masukkan ${info.name}`"
            required
          />
        </div>
      </div>

      <!-- Payment Summary -->
      <div class="payment-summary">
        <div class="summary-row">
          <span>Harga Produk</span>
          <span>{{ formatCurrencyV2(product.price) }}</span>
        </div>
        <div class="summary-row">
          <span>Biaya Layanan</span>
          <span>{{ formatCurrencyV2(platformFee) }}</span>
        </div>
        <div class="divider"></div>
        <div class="summary-row total">
          <span>Total</span>
          <span>{{ formatCurrencyV2(totalPrice) }}</span>
        </div>
      </div>

      <!-- Stock Status -->
      <div class="stock-status">
        <i :class="product.stock_available ? 'bi bi-check-circle' : 'bi bi-x-circle'"></i>
        <span>{{ product.stock_available ? 'Stok Tersedia' : 'Stok Habis' }}</span>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button type="button" class="whatsapp-btn" @click="openWhatsApp">
          <i class="bi bi-whatsapp"></i>
          WhatsApp
        </button>
        <button 
          type="submit" 
          class="buy-btn"
          :disabled="isLoading || !product.stock_available"
        >
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Beli Sekarang</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { formatCurrencyV2 } from '~/utils'
import Swal from 'sweetalert2'

const config = useRuntimeConfig()
const { $api } = useNuxtApp()

interface Product {
  _id: number | string
  name: string
  price: number
  original_price?: number
  additional_information?: string
  stock_available?: boolean
}

interface PurchaseInfo {
  name: string
  value: string
}

const props = defineProps<{ product: Product }>()

const isLoading = ref(false)
const purchaseFormData = ref<PurchaseInfo[]>([])

interface Contact {
  url: string;
}

// Open WhatsApp contact
const openWhatsApp = () => {
  const contacts = config.public.contacts as Contact[];
  if (contacts && contacts.length > 0) {
    window.open(contacts[0].url, '_blank');
  }
};

// Watch for product changes
watch(() => props.product, (newProduct) => {
  purchaseFormData.value = []
  if (newProduct?.additional_information && typeof newProduct.additional_information === 'string') {
    try {
      const parsedInfo = JSON.parse(newProduct.additional_information)
      if (Array.isArray(parsedInfo)) {
        purchaseFormData.value = parsedInfo.map(info => ({
          name: info.name,
          value: ''
        }))
      }
    } catch (e) {
      console.error('Gagal mem-parsing additional_information:', e)
    }
  }
}, { immediate: true, deep: true })

// Calculate pricing
const calculatePricingDetails = (base: number, taxPercent: number) => {
  const tax = base * (taxPercent / 100)
  return { 
    tax: Number(Math.round(tax)?.toFixed(0)), 
    total: base + tax 
  }
}

const platformFee = computed(() => 
  calculatePricingDetails(props.product.price, config.public.tax as number).tax
)

const totalPrice = computed(() => 
  Number(props.product.price) + Number(platformFee.value)
)

// Handle buy action
const handleBuy = async (productId: number | string) => {
  if (!props.product.stock_available) {
    Swal.fire({ 
      icon: 'error', 
      text: 'Maaf, stok produk ini telah habis.' 
    })
    return
  }

  // Validate form fields
  for (const info of purchaseFormData.value) {
    if (!info.value.trim()) {
      Swal.fire({ 
        icon: 'warning', 
        text: `Harap isi kolom "${info.name}" terlebih dahulu.` 
      })
      return
    }
  }

  isLoading.value = true
  try {
    const res = await $api('/api/v1/checkout', {
      method: 'POST',
      body: {
        item: productId,
        additional_information: purchaseFormData.value
      }
    })
    
    if (!res.status) throw new Error(res.msg)
    
    // Reset form on success
    purchaseFormData.value.forEach(info => info.value = '')
    
    // Redirect to payment page
    await navigateTo(res.data.redirect)
    
  } catch (error: any) {
    const msg = error?.data?.msg || 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.'
    Swal.fire({ icon: 'error', text: msg })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.buy-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.price-section {
  margin-bottom: 1.5rem;
}

.current-price {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.original-price {
  font-size: 1rem;
  color: #95a5a6;
  text-decoration: line-through;
  margin-left: 0.5rem;
}

.additional-info {
  margin-bottom: 1.5rem;
}

.additional-info h4 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.info-field {
  margin-bottom: 1rem;
}

.info-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.info-field input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.payment-summary {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.summary-row.total {
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 0.75rem 0;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.stock-status i {
  font-size: 1.2rem;
}

.bi-check-circle {
  color: #2ecc71;
}

.bi-x-circle {
  color: #e74c3c;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.whatsapp-btn, .buy-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.whatsapp-btn {
  background: #25D366;
  color: white;
  border: none;
}

.whatsapp-btn:hover {
  background: #128C7E;
}

.buy-btn {
  background: #3498db;
  color: white;
  border: none;
}

.buy-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.buy-btn:not(:disabled):hover {
  background: #2980b9;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }
  
  .whatsapp-btn, .buy-btn {
    width: 100%;
  }
}
</style>