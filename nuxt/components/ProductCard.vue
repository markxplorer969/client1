<template>
  <div class="product-card" :class="{ 'out-of-stock': !product.stock_available }">
    <div class="product-image-container">
      <img 
        :src="getImageUrl(product)" 
        :alt="product.name" 
        class="product-image"
        @error="handleImageError"
        loading="lazy"
      >
      <div class="image-overlay"></div>
      
      <span v-if="product.label" class="product-badge">{{ product.label }}</span>
      
      <div v-if="!product.stock_available" class="out-of-stock-overlay">
        <div class="out-of-stock-content">
          <i class="bi bi-x-circle"></i>
          <span class="out-of-stock-text">Stok Habis</span>
        </div>
      </div>
      
      <div class="product-actions">
        <button class="quick-view-btn" @click.stop="quickView" aria-label="Quick view">
          <i class="bi bi-eye"></i>
        </button>
        <button class="wishlist-btn" @click.stop="toggleWishlist" aria-label="Add to wishlist">
          <i class="bi" :class="isWishlisted ? 'bi-heart-fill' : 'bi-heart'"></i>
        </button>
      </div>

      <div class="quick-add-cart" v-if="product.stock_available">
        <button class="quick-add-btn" @click.stop="addToCart">
          <i class="bi bi-cart-plus"></i>
          Tambah ke Keranjang
        </button>
      </div>
    </div>

    <div class="product-info">
      <div class="product-category" v-if="product.category">
        <span>{{ product.category }}</span>
      </div>
      
      <h3 class="product-name">{{ product.name }}</h3>
      
      <p class="product-description">{{ formatDescription(product.description) }}</p>
      
      <div class="rating-container" v-if="product.rating">
        <div class="stars">
          <i v-for="star in 5" :key="star" class="bi" 
            :class="star <= Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'"></i>
        </div>
        <span class="rating-value">({{ product.rating }})</span>
        <span class="review-count" v-if="product.review_count">{{ product.review_count }} ulasan</span>
      </div>
      
      <div class="product-price">
        <div class="price-container">
          <span class="current-price">Rp {{ formatCurrency(product.price) }}</span>
          <span v-if="product.original_price" class="original-price">
            Rp {{ formatCurrency(product.original_price) }}
          </span>
        </div>
        <span v-if="product.discount_percent" class="discount-badge">
          -{{ product.discount_percent }}%
        </span>
      </div>

      <div class="product-meta" v-if="product.sold_count || product.stock">
        <div class="sold-count" v-if="product.sold_count">
          <i class="bi bi-cart-check"></i>
          {{ product.sold_count }} terjual
        </div>
        <div class="stock-info" v-if="product.stock">
          <i class="bi bi-box"></i>
          {{ product.stock }} tersedia
        </div>
      </div>

      <div class="product-footer">
        <button 
          class="view-detail-btn"
          @click="$router.push('/product/' + product._id)"
          :disabled="!product.stock_available"
        >
          <i class="bi bi-arrow-right"></i>
          <span>{{ product.stock_available ? 'Lihat Detail' : 'Stok Habis' }}</span>
        </button>
        
        <button class="add-cart-btn" :disabled="!product.stock_available" @click.stop="addToCart" aria-label="Add to cart">
          <i class="bi bi-cart-plus"></i>
        </button>
      </div>
    </div>

    <div class="product-hover-effect"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      _id: '',
      name: '',
      description: '',
      price: 0,
      original_price: 0,
      discount_percent: 0,
      label: '',
      category: '',
      imageUrl: '',
      image: '',
      images: [],
      stock_available: true,
      stock: 0,
      sold_count: 0,
      rating: 0,
      review_count: 0
    })
  }
})

const isWishlisted = ref(false)
const imageError = ref(false)

const getImageUrl = (product) => {
  // Prioritaskan imageUrl jika ada
  if (product.imageUrl && !imageError.value) {
    return product.imageUrl
  }
  
  // Coba gunakan image jika imageUrl tidak ada atau error
  if (product.image && !imageError.value) {
    return product.image
  }
  
  // Coba gunakan images array jika ada
  if (product.images && product.images.length > 0 && !imageError.value) {
    return product.images[0]
  }
  
  // Fallback ke placeholder yang lebih bagus
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value || 0)
}

const formatDescription = (desc) => {
  if (!desc) return 'Tidak ada deskripsi produk'
  return desc.length > 80 ? desc.substring(0, 80) + '...' : desc
}

const handleImageError = (event) => {
  imageError.value = true
  event.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80'
}

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value
  // Emit event atau panggil API di sini
  console.log('Wishlist toggled:', props.product.name, isWishlisted.value)
}

const addToCart = () => {
  // Logika tambah ke keranjang
  console.log('Added to cart:', props.product.name)
  // Bisa ditambahkan efek feedback
}

const quickView = () => {
  // Logika quick view
  console.log('Quick view:', props.product.name)
}
</script>

<style scoped>
.product-card {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.2),
    0 5px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(96, 165, 250, 0.2),
    0 10px 20px rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.3);
}

.product-card.out-of-stock {
  opacity: 0.85;
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  background: linear-gradient(45deg, #1e293b, #334155);
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 60%);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.product-card:hover .image-overlay {
  opacity: 0.6;
}

.product-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: linear-gradient(135deg, #818cf8 0%, #60a5fa 100%);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 25px;
  font-size: 0.8rem;
  font-weight: 700;
  z-index: 3;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  backdrop-filter: blur(4px);
}

.out-of-stock-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #f87171;
}

.out-of-stock-content i {
  font-size: 2rem;
}

.out-of-stock-text {
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 0.6rem;
  z-index: 3;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateY(0);
}

.quick-view-btn,
.wishlist-btn {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.quick-view-btn:hover {
  background: rgba(96, 165, 250, 0.9);
  color: white;
  transform: scale(1.12) translateY(-2px);
  box-shadow: 0 6px 20px rgba(96, 165, 250, 0.4);
}

.wishlist-btn:hover {
  background: rgba(248, 113, 113, 0.9);
  color: white;
  transform: scale(1.12) translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.4);
}

.wishlist-btn .bi-heart-fill {
  color: #f87171;
}

.quick-add-cart {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  z-index: 3;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.product-card:hover .quick-add-cart {
  opacity: 1;
  transform: translateY(0);
}

.quick-add-btn {
  width: 100%;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(135deg, #818cf8 0%, #60a5fa 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.quick-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(96, 165, 250, 0.5);
}

.product-info {
  padding: 1.5rem;
  position: relative;
  z-index: 2;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-category {
  margin-bottom: 0.75rem;
}

.product-category span {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.product-description {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0 0 1.25rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.stars {
  display: flex;
  gap: 0.15rem;
}

.stars .bi {
  color: #fbbf24;
  font-size: 0.95rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.rating-value {
  color: #cbd5e1;
  font-size: 0.85rem;
  font-weight: 600;
}

.review-count {
  color: #64748b;
  font-size: 0.8rem;
}

.product-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #60a5fa;
  text-shadow: 0 2px 4px rgba(96, 165, 250, 0.2);
}

.original-price {
  font-size: 1rem;
  color: #64748b;
  text-decoration: line-through;
}

.discount-badge {
  background: linear-gradient(135deg, #f87171 0%, #fb7185 100%);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(248, 113, 113, 0.3);
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: #64748b;
  font-size: 0.85rem;
}

.sold-count,
.stock-info {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.product-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}

.view-detail-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.25rem;
  background: linear-gradient(135deg, #818cf8 0%, #60a5fa 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.3);
}

.view-detail-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(96, 165, 250, 0.4);
}

.view-detail-btn:disabled {
  background: #475569;
  cursor: not-allowed;
  opacity: 0.7;
}

.add-cart-btn {
  width: 50px;
  height: 50px;
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.25);
  color: #60a5fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.add-cart-btn:hover:not(:disabled) {
  background: rgba(96, 165, 250, 0.25);
  transform: scale(1.08);
  color: white;
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
}

.add-cart-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.05) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.product-card:hover .product-hover-effect {
  opacity: 1;
}

/* Animation for wishlist */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.wishlist-btn .bi-heart-fill {
  animation: pulse 0.4s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-actions {
    opacity: 1;
    transform: translateY(0);
  }
  
  .product-info {
    padding: 1.25rem;
  }
  
  .product-name {
    font-size: 1.1rem;
  }
  
  .current-price {
    font-size: 1.25rem;
  }
  
  .view-detail-btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .add-cart-btn {
    width: 45px;
    height: 45px;
  }
  
  .quick-add-cart {
    opacity: 1;
    transform: translateY(0);
    padding: 1rem;
  }
  
  .quick-add-btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .product-card {
    border-radius: 16px;
  }
  
  .product-info {
    padding: 1rem;
  }
  
  .product-name {
    font-size: 1rem;
  }
  
  .product-price {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .product-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .product-footer {
    flex-direction: column;
  }
  
  .view-detail-btn {
    width: 100%;
  }
  
  .add-cart-btn {
    width: 100%;
    height: 45px;
  }
}

/* Loading animation for image */
.product-image.loading {
  background: linear-gradient(90deg, #1e293b 25%, #2d3748 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>