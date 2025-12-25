<template>
  <div class="user-dashboard">
    <!-- Header Dashboard -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">
          <span v-if="user.name">Selamat Datang, {{ user.name }}!</span>
          <span v-else>Dasbor Anda</span>
        </h1>
        <p class="dashboard-subtitle">Ringkasan aktivitas dan pembelian Anda</p>
      </div>
      <button 
        @click="$router.push('/products')" 
        class="browse-btn"
      >
        <i class="bi bi-shop"></i>
        <span>Telusuri Produk</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Memuat data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="error-state">
      <div class="error-icon">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
      <h3>Gagal Memuat Data</h3>
      <p>{{ errorMsg }}</p>
      <button @click="fetchDashboardData" class="retry-btn">
        Coba Lagi
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="dashboard-content">
      <!-- Stat Cards -->
      <div class="stat-cards">
        <div class="stat-card spending">
          <div class="stat-icon">
            <i class="bi bi-wallet2"></i>
          </div>
          <div class="stat-info">
            <h4>Total Belanja</h4>
            <p>Rp {{ formatCurrency(customerStats.totalSpending) }}</p>
          </div>
        </div>

        <div class="stat-card transactions">
          <div class="stat-icon">
            <i class="bi bi-receipt-cutoff"></i>
          </div>
          <div class="stat-info">
            <h4>Total Transaksi</h4>
            <p>{{ customerStats.totalTransactions }} Transaksi</p>
          </div>
        </div>

        <div class="stat-card products">
          <div class="stat-icon">
            <i class="bi bi-box-seam"></i>
          </div>
          <div class="stat-info">
            <h4>Produk Dimiliki</h4>
            <p>{{ customerStats.productsOwned }} Produk</p>
          </div>
        </div>

        <div class="stat-card member">
          <div class="stat-icon">
            <i class="bi bi-calendar-check"></i>
          </div>
          <div class="stat-info">
            <h4>Member Sejak</h4>
            <p>{{ formatDate(user.registrationDate) }}</p>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="dashboard-grid">
        <!-- Recent Transactions -->
        <div class="recent-transactions">
          <div class="card-header">
            <h3>Riwayat Transaksi</h3>
            <div class="search-box">
              <i class="bi bi-search"></i>
              <input 
                type="text" 
                v-model="transactionSearchQuery" 
                placeholder="Cari transaksi..."
              >
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Produk</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Jumlah</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedTransactions.length === 0">
                  <td colspan="6" class="empty-state">
                    <i class="bi bi-receipt"></i>
                    <p>Tidak ada transaksi</p>
                  </td>
                </tr>
                <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
                  <td>#{{ transaction.id }}</td>
                  <td>{{ transaction.productName }}</td>
                  <td>{{ formatDate(transaction.date) }}</td>
                  <td>
                    <span :class="`status-badge ${transaction.status.toLowerCase()}`">
                      {{ transaction.status }}
                    </span>
                  </td>
                  <td>Rp {{ formatCurrency(transaction.amount) }}</td>
                  <td>
                    <button 
                      @click="viewTransaction(transaction.id)" 
                      class="view-btn"
                      title="Lihat Detail"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <div class="pagination-info">
              Menampilkan {{ showingStart }} - {{ showingEnd }} dari {{ filteredTransactions.length }} transaksi
            </div>
            <div class="pagination-controls">
              <button 
                @click="goToTransactionPage(transactionCurrentPage - 1)" 
                :disabled="transactionCurrentPage === 1"
              >
                <i class="bi bi-chevron-left"></i>
              </button>
              <span>Halaman {{ transactionCurrentPage }} dari {{ totalTransactionPages }}</span>
              <button 
                @click="goToTransactionPage(transactionCurrentPage + 1)" 
                :disabled="transactionCurrentPage === totalTransactionPages"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Purchased Products -->
        <div class="purchased-products">
          <div class="card-header">
            <h3>Produk Anda</h3>
          </div>

          <div class="products-list">
            <div v-if="purchasedProducts.length === 0" class="empty-state">
              <i class="bi bi-box-seam"></i>
              <p>Anda belum membeli produk</p>
            </div>

            <div 
              v-for="product in purchasedProducts" 
              :key="product.id" 
              class="product-item"
            >
              <div class="product-icon">
                <i class="bi bi-box-seam"></i>
              </div>
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <p>Dibeli pada {{ formatDate(product.purchaseDate) }}</p>
              </div>
              <a 
                v-if="product.downloadLink" 
                :href="product.downloadLink" 
                class="download-btn"
                title="Unduh Produk"
              >
                <i class="bi bi-download"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const { $api } = useNuxtApp()
const router = useRouter()

// Data state
const isLoading = ref(true)
const errorMsg = ref(null)
const user = ref({
  name: '',
  registrationDate: ''
})
const customerStats = ref({
  totalSpending: 0,
  totalTransactions: 0,
  productsOwned: 0
})
const recentTransactions = ref([])
const purchasedProducts = ref([])

// Pagination and search
const transactionSearchQuery = ref('')
const transactionCurrentPage = ref(1)
const transactionItemsPerPage = ref(5)

// Computed properties
const filteredTransactions = computed(() => {
  if (!transactionSearchQuery.value) return recentTransactions.value || [];
  const query = transactionSearchQuery.value.toLowerCase();
  return (recentTransactions.value || []).filter(transaction => 
    transaction.productName.toLowerCase().includes(query) ||
    transaction.id.toString().includes(query)
  );
});

const totalTransactionPages = computed(() => {
  const totalItems = filteredTransactions.value.length || 0;
  const itemsPerPage = transactionItemsPerPage.value || 1;
  return Math.ceil(totalItems / itemsPerPage);
});

const paginatedTransactions = computed(() => {
  const start = (transactionCurrentPage.value - 1) * transactionItemsPerPage.value;
  const end = start + transactionItemsPerPage.value;
  return filteredTransactions.value.slice(start, end);
});

const showingStart = computed(() => {
  return (transactionCurrentPage.value - 1) * transactionItemsPerPage.value + 1;
});

const showingEnd = computed(() => {
  const end = transactionCurrentPage.value * transactionItemsPerPage.value;
  return end > filteredTransactions.value.length ? filteredTransactions.value.length : end;
});

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { day: '2-digit', month: 'long', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const fetchDashboardData = async () => {
  isLoading.value = true
  errorMsg.value = null
  try {
    const res = await $api('/api/v1/statistic')
    if (!res?.status || !res.data) {
      throw new Error(res.msg || 'Gagal memuat data dashboard')
    }
    
    const apiData = res.data
    
    // Set user data
    user.value = {
      name: apiData.name || '',
      registrationDate: apiData.joinedAt || new Date().toISOString()
    }
    
    // Set customer stats
    customerStats.value = {
      totalSpending: apiData.stats?.totalPurchase || 0,
      totalTransactions: apiData.stats?.totalTransactions || 0,
      productsOwned: apiData.stats?.totalItems || 0
    }
    
    // Process transactions
    recentTransactions.value = apiData.transactions?.map(tx => ({
      id: tx._id,
      productName: tx.items?.map(item => item.name).join(', ') || 'Produk tidak tersedia',
      date: tx.created_at || new Date().toISOString(),
      status: tx.status || 'Unknown',
      amount: tx.amount || 0
    })) || []
    
    // Process purchased products
    purchasedProducts.value = apiData.transactions
      ?.filter(tx => tx.status === 'Paid')
      ?.flatMap(tx => 
        tx.items?.map(item => ({
          id: `${tx._id}-${item._id || item.name}`,
          name: item.name || 'Produk tidak diketahui',
          purchaseDate: tx.created_at || new Date().toISOString(),
          downloadLink: item.downloadUrl || '#'
        })) || []
      ) || []
      
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
    errorMsg.value = err.message || 'Terjadi kesalahan saat memuat data'
  } finally {
    isLoading.value = false
  }
}

const viewTransaction = (transactionId) => {
  router.push(`/invoice/${transactionId}`)
}

const goToTransactionPage = (page) => {
  if (page >= 1 && page <= totalTransactionPages.value) {
    transactionCurrentPage.value = page
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.user-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content {
  flex: 1;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  color: #7f8c8d;
  margin: 0;
}

.browse-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #3498db;
  color: white;
  border: none;
}

.browse-btn:hover {
  background-color: #2980b9;
}

.browse-btn i {
  font-size: 1.1rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  gap: 1rem;
}

.loading-state .spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(52, 152, 219, 0.2);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background: #fdecea;
  border-radius: 12px;
  margin: 2rem 0;
}

.error-icon {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #e74c3c;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.retry-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #c0392b;
}

/* Stat Cards */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-card.spending .stat-icon {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.stat-card.transactions .stat-icon {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.stat-card.products .stat-icon {
  background: rgba(155, 89, 182, 0.1);
  color: #9b59b6;
}

.stat-card.member .stat-icon {
  background: rgba(241, 196, 15, 0.1);
  color: #f1c40f;
}

.stat-info h4 {
  font-size: 1rem;
  font-weight: 500;
  color: #7f8c8d;
  margin: 0 0 0.25rem;
}

.stat-info p {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 2fr 1fr;
  }
}

/* Recent Transactions */
.recent-transactions {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.search-box {
  position: relative;
  min-width: 250px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
}

.empty-state {
  padding: 3rem 1rem;
  text-align: center;
  color: #95a5a6;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.completed,
.status-badge.paid {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.status-badge.pending {
  background: rgba(241, 196, 15, 0.1);
  color: #f1c40f;
}

.status-badge.cancelled {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.status-badge.processing {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.view-btn {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: rgba(52, 152, 219, 0.1);
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-controls button {
  background: white;
  border: 1px solid #ddd;
  color: #3498db;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls button:not(:disabled):hover {
  background: #f8f9fa;
}

.pagination-controls span {
  font-size: 0.85rem;
  color: #7f8c8d;
  padding: 0 0.5rem;
}

/* Purchased Products */
.purchased-products {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.products-list {
  padding: 0.5rem 0;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  transition: background 0.2s ease;
  border-bottom: 1px solid #eee;
}

.product-item:last-child {
  border-bottom: none;
}

.product-item:hover {
  background: #f8f9fa;
}

.product-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
}

.product-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem;
}

.product-info p {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
}

.download-btn {
  color: #3498db;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.download-btn:hover {
  background: rgba(52, 152, 219, 0.1);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
  }
  
  .browse-btn {
    width: 100%;
    justify-content: center;
  }
  
  .stat-cards {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
  }
  
  .table-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .pagination-controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style>