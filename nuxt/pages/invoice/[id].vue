<template>
  <div class="invoice-container">
    <div class="container px-3 py-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="loading-text">Memuat invoice...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="alert alert-danger">
          <h5><i class="bi bi-exclamation-triangle-fill me-2"></i>Gagal Memuat Data</h5>
          <p class="mb-0">{{ error }}</p>
        </div>
      </div>

      <!-- Invoice Content -->
      <div v-else-if="invoice" class="row g-4">
        <!-- QR Payment Section -->
        <div class="col-lg-5">
          <div class="payment-card">
            <div class="card-header">
              <h5><i class="bi bi-qr-code-scan me-2"></i>Pindai untuk Membayar</h5>
            </div>
            <div class="card-body">
              <div class="qr-wrapper">
                <img :src="invoice.qr" alt="QRIS Payment Code" class="qr-image">
              </div>
              
              <div v-if="countdownText" class="payment-timer alert alert-warning">
                <i class="bi bi-clock-fill me-2"></i>
                <span>Bayar sebelum: <strong>{{ countdownText }}</strong></span>
              </div>
              
              <button 
                class="btn btn-primary w-100 mt-3" 
                @click="checkPaymentStatus"
                :disabled="invoice.status === 'Lunas' || invoice.status === 'Kadaluwarsa'"
              >
                <i class="bi bi-arrow-repeat me-2"></i>Cek Status Pembayaran
              </button>
            </div>
          </div>
        </div>

        <!-- Invoice Details Section -->
        <div class="col-lg-7">
          <div class="details-card">
            <div class="card-header">
              <h4><i class="bi bi-receipt me-2"></i>Detail Transaksi</h4>
            </div>
            
            <div class="card-body">
              <!-- Transaction Status -->
              <div class="status-badge mb-4" :class="statusBadgeClass">
                {{ invoice.status }}
              </div>

              <!-- Transaction Details -->
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">ID Transaksi</span>
                  <span class="detail-value">{{ invoice.id }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Email</span>
                  <span class="detail-value">{{ invoice.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tanggal</span>
                  <span class="detail-value">{{ formatDate(invoice.createdAt) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Metode Pembayaran</span>
                  <span class="detail-value">{{ invoice.paymentMethod.toUpperCase() }}</span>
                </div>
              </div>

              <!-- Additional Information -->
              <div v-if="invoice.additionalInformation && invoice.additionalInformation.length > 0">
                <hr class="divider">
                <h6 class="section-title"><i class="bi bi-info-circle me-2"></i>Informasi Pesanan</h6>
                <div class="detail-grid">
                  <div v-for="info in invoice.additionalInformation" :key="info.name" class="detail-item">
                    <span class="detail-label">{{ info.name }}</span>
                    <span class="detail-value">{{ info.value }}</span>
                  </div>
                </div>
              </div>

              <!-- Order Summary -->
              <hr class="divider">
              <h6 class="section-title"><i class="bi bi-cart-check me-2"></i>Ringkasan Pesanan</h6>
              <div class="order-items">
                <div v-for="item in invoice.items" :key="item.name" class="order-item">
                  <span class="item-name">{{ item.name }} <small class="text-muted">(x{{ item.quantity }})</small></span>
                  <span class="item-price">{{ formatCurrency(item.price) }}</span>
                </div>
              </div>

              <!-- Fee -->
              <div class="fee-row">
                <span class="fee-label">Biaya Penanganan</span>
                <span class="fee-value">{{ formatCurrency(invoice.fee) }}</span>
              </div>

              <!-- Total -->
              <hr class="divider">
              <div class="total-row">
                <span class="total-label">Total Pembayaran</span>
                <span class="total-amount">{{ formatCurrency(invoice.total) }}</span>
              </div>

              <!-- Download Section -->
              <div v-if="invoice.status === 'Lunas' && downloadableItems.length > 0">
                <hr class="divider">
                <h6 class="section-title"><i class="bi bi-download me-2"></i>File Download</h6>

                <div v-if="isDownloadExpired" class="alert alert-danger">
                  <i class="bi bi-exclamation-circle-fill me-2"></i>
                  Sesi unduhan telah berakhir. Silakan hubungi admin jika Anda mengalami kendala.
                </div>
                <div v-else class="download-buttons">
                  <div v-for="item in downloadableItems" :key="item.name" class="mb-2">
                    <a 
                      :href="item.file.data" 
                      :download="item.file.type === 'local'" 
                      target="_blank"
                      rel="noopener noreferrer" 
                      class="btn btn-success w-100"
                    >
                      <i class="bi bi-download me-2"></i>
                      Download {{ item.name }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

useHead({ title: 'Invoice' })
const config = useRuntimeConfig()
const { $api } = useNuxtApp()
const route = useRoute()
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

interface FileObject { type: 'local' | 'cloud'; data: string }
interface ItemWithFile extends Item { file: FileObject }
interface Item { name: string; price: number; quantity: number; file?: FileObject }
interface AdditionalInfo { name: string; value: string }
interface ApiData {
  _id: string; email: string; amount: number; items: (Item & { productId: string })[]
  qr: string; status: 'Pending' | 'Success' | 'Paid' | 'Expired'; created_at: string
  paid_at?: string; payment_method: string; additional_information?: AdditionalInfo[]
}
interface Invoice {
  id: string; status: string; email: string; createdAt: string; paidAt?: string
  expiresAt: string; items: Item[]; fee: number; total: number; qr: string
  paymentMethod: string; additionalInformation?: AdditionalInfo[]
}

const invoice = ref<Invoice | null>(null)
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)
const countdownText = ref<string>('')
const isDownloadExpired = ref(false)

let countdownInterval: NodeJS.Timeout | null = null
let paymentCheckInterval: NodeJS.Timeout | null = null
let expirationCheckInterval: NodeJS.Timeout | null = null

const downloadableItems = computed((): ItemWithFile[] => invoice.value?.items.filter((item): item is ItemWithFile => !!item.file) || [])
const statusBadgeClass = computed(() => {
  if (!invoice.value) return 'secondary'
  switch (invoice.value.status) {
    case 'Lunas': return 'success'
    case 'Kadaluwarsa': return 'danger'
    case 'Pending': return 'warning'
    default: return 'secondary'
  }
})

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { 
  style: 'currency', 
  currency: 'IDR', 
  minimumFractionDigits: 0 
}).format(value)

const formatDate = (dateString: string) => new Date(dateString).toLocaleString('id-ID', { 
  dateStyle: 'medium', 
  timeStyle: 'short' 
})

const padZero = (num: number) => String(num).padStart(2, '0')

const stopAllIntervals = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (paymentCheckInterval) clearInterval(paymentCheckInterval)
  if (expirationCheckInterval) clearInterval(expirationCheckInterval)
}

const checkDownloadExpiration = () => {
  if (!invoice.value?.paidAt) return

  const expirationHours = (config.public.downloadLinkExpiresInHours as number) || 1
  const paidTimestamp = new Date(invoice.value.paidAt).getTime()
  const expirationTimestamp = paidTimestamp + (expirationHours * 60 * 60 * 1000)

  if (Date.now() > expirationTimestamp) {
    isDownloadExpired.value = true
    if (expirationCheckInterval) clearInterval(expirationCheckInterval)
  }
}

const updateCountdown = () => {
  if (!invoice.value?.expiresAt || invoice.value.status !== 'Pending') {
    stopAllIntervals()
    if (invoice.value) countdownText.value = `Status: ${invoice.value.status}`
    return
  }
  
  const now = new Date().getTime()
  const expirationTime = new Date(invoice.value.expiresAt).getTime()
  const timeDifference = expirationTime - now
  
  if (timeDifference <= 0) {
    if (invoice.value) invoice.value.status = 'Kadaluwarsa'
    countdownText.value = 'Waktu Habis'
    stopAllIntervals()
    return
  }
  
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
  countdownText.value = `${padZero(minutes)}:${padZero(seconds)}`
}

const pollPaymentStatus = async (isManual: boolean = false) => {
  if (!invoice.value || invoice.value.status !== 'Pending') return
  
  if (isManual) {
    Swal.fire({ 
      title: 'Mengecek status...', 
      didOpen: () => Swal.showLoading(), 
      allowOutsideClick: false 
    })
  }
  
  try {
    const response = await $api('/api/v1/check', { 
      method: 'POST', 
      body: { id: invoice.value.id } 
    })
    
    if (response.status) {
      await fetchInvoice()
      Swal.close()
      Swal.fire({
        title: 'Pembayaran Berhasil!',
        text: 'Terima kasih telah melakukan pembayaran.',
        icon: 'success',
        confirmButtonText: 'OK'
      })
    } else if (isManual) {
      Swal.fire({
        title: 'Masih Pending',
        text: 'Pembayaran untuk invoice ini belum terdeteksi.',
        icon: 'info',
        confirmButtonText: 'Mengerti'
      })
    }
  } catch (err) {
    if (isManual) {
      Swal.fire({
        title: 'Error',
        text: 'Gagal menghubungi server untuk cek status.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }
}

const checkPaymentStatus = () => pollPaymentStatus(true)

const fetchInvoice = async () => {
  try {
    isLoading.value = true
    const response = await $api<{ status: boolean; data: ApiData }>(`/api/v1/invoice?id=${id}`)
    
    if (!response || !response.status || !response.data) {
      throw new Error('Invoice tidak ditemukan.')
    }

    const apiData = response.data
    const itemsTotal = apiData.items?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
    const calculatedFee = apiData.amount - itemsTotal
    const createdAt = new Date(apiData.created_at)
    const expiresAt = new Date(createdAt.getTime() + 10 * 60 * 1000).toISOString()

    invoice.value = {
      id: apiData._id,
      status: apiData.status === 'Paid' ? 'Lunas' : apiData.status,
      email: apiData.email,
      createdAt: apiData.created_at,
      paidAt: apiData.paid_at,
      expiresAt: expiresAt,
      items: apiData.items.map(item => ({ ...item })),
      fee: calculatedFee,
      total: apiData.amount,
      qr: apiData.qr,
      paymentMethod: apiData.payment_method,
      additionalInformation: apiData.additional_information || []
    }

    stopAllIntervals()

    if (invoice.value.status === 'Pending') {
      updateCountdown()
      countdownInterval = setInterval(updateCountdown, 1000)
      paymentCheckInterval = setInterval(() => pollPaymentStatus(false), 5000)
    } else if (invoice.value.status === 'Lunas') {
      checkDownloadExpiration()
      expirationCheckInterval = setInterval(checkDownloadExpiration, 60000)
    }

  } catch (e: any) {
    console.error(e)
    error.value = e.data?.message || "Gagal memuat detail invoice."
    stopAllIntervals()
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchInvoice)
onUnmounted(stopAllIntervals)
</script>

<style scoped>
.invoice-container {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.loading-state {
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
  font-size: 1.1rem;
  color: #6c757d;
}

.error-state {
  margin-top: 2rem;
}

.error-state .alert {
  max-width: 600px;
  margin: 0 auto;
}

.payment-card, .details-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.card-header {
  padding: 1.5rem 1.5rem 0;
  border-bottom: none;
}

.card-header h4, .card-header h5 {
  font-weight: 600;
  color: #2c3e50;
}

.card-body {
  padding: 1.5rem;
}

.qr-wrapper {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.qr-image {
  width: 220px;
  height: 220px;
  object-fit: contain;
}

.payment-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  margin-bottom: 0;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.status-badge.success {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.danger {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-badge.warning {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.85rem;
  color: #6c757d;
}

.detail-value {
  font-weight: 500;
  color: #2c3e50;
}

.section-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.divider {
  border-top: 1px solid #e9ecef;
  margin: 1.5rem 0;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
}

.item-name {
  color: #2c3e50;
}

.item-price {
  font-weight: 500;
  color: #2c3e50;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.fee-label {
  color: #6c757d;
}

.fee-value {
  color: #6c757d;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.total-label {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2c3e50;
}

.total-amount {
  font-weight: 700;
  font-size: 1.2rem;
  color: #1a56db;
}

.download-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-primary {
  background-color: #1a56db;
  border-color: #1a56db;
}

.btn-primary:hover {
  background-color: #1649c0;
  border-color: #1649c0;
}

.btn-success {
  background-color: #057a55;
  border-color: #057a55;
}

.btn-success:hover {
  background-color: #046c4e;
  border-color: #046c4e;
}

@media (max-width: 991.98px) {
  .qr-image {
    width: 180px;
    height: 180px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 575.98px) {
  .card-header, .card-body {
    padding: 1.25rem;
  }
  
  .qr-wrapper {
    padding: 0.75rem;
  }
  
  .qr-image {
    width: 160px;
    height: 160px;
  }
}
</style>