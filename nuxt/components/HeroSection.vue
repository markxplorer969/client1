<template>
  <header class="hero-section">
    <!-- Background Video -->
    <video 
      autoplay 
      muted 
      loop 
      playsinline 
      preload="auto" 
      class="hero-video"
      @error="handleVideoError"
    >
      <source src="/videos/hero-bg.mp4" type="video/mp4" />
    </video>

    <!-- Overlay Gradient -->
    <div class="hero-overlay"></div>

    <!-- Hero Content -->
    <div class="hero-content container">
      <div class="hero-text animate-up">
        <h1 class="hero-title">{{ heroData.title }}</h1>
        <p class="hero-subtitle">{{ heroData.subtitle }}</p>
        <div class="hero-cta">
          <button 
            @click="$router.push('/products')" 
            class="cta-btn primary"
            aria-label="Lihat Produk"
          >
            <i class="bi bi-shop"></i>
            <span>Lihat Produk</span>
          </button>
          <button 
            @click="scrollToFeatures" 
            class="cta-btn secondary"
            aria-label="Pelajari Lebih"
          >
            <i class="bi bi-info-circle"></i>
            <span>Pelajari Lebih</span>
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="hero-stats animate-fade">
        <div 
          v-for="(stat, index) in heroStats" 
          :key="index" 
          class="stat-item"
        >
          <div class="stat-number">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Fallback Image -->
    <img 
      v-if="showFallback" 
      :src="fallbackImage" 
      alt="Hero Background" 
      class="hero-fallback"
    />

    <!-- Scroll Indicator -->
    <div 
      class="scroll-indicator" 
      @click="scrollToContent"
      aria-label="Scroll ke bawah"
    >
      <i class="bi bi-chevron-down"></i>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const config = useRuntimeConfig()
const showFallback = ref(false)

const heroData = ref({
  title: config.public.hero?.title || 'Temukan Produk Terbaik',
  subtitle: config.public.hero?.highlight || 'Kualitas premium dengan harga terjangkau',
  stats: {
    products: config.public.hero?.stats?.products || 120,
    customers: config.public.hero?.stats?.customers || 8000,
    satisfaction: config.public.hero?.stats?.satisfaction || 99
  }
})

const heroStats = [
  { value: `${heroData.value.stats.products}+`, label: 'Produk Tersedia' },
  { value: `${heroData.value.stats.customers}+`, label: 'Pelanggan' },
  { value: `${heroData.value.stats.satisfaction}%`, label: 'Kepuasan' }
]

const fallbackImage = '/images/hero-fallback.jpg'

const scrollToContent = () => {
  document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToFeatures = () => {
  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })
}

const handleVideoError = () => {
  showFallback.value = true
}
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.hero-video,
.hero-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.6) 0%,
    rgba(0,0,0,0.4) 50%,
    rgba(0,0,0,0.7) 100%
  );
  z-index: -1;
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 2;
  padding: 2rem 1rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 2px 4px 12px rgba(0,0,0,0.7);
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  margin-bottom: 2rem;
  opacity: 0.95;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.8rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.cta-btn i {
  font-size: 1.2rem;
}

.cta-btn.primary {
  background: var(--primary-color);
  color: #fff;
  box-shadow: 0 6px 18px rgba(0,0,0,0.3);
}
.cta-btn.primary:hover {
  background: var(--primary-dark-color);
  transform: translateY(-3px);
}

.cta-btn.secondary {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(6px);
  color: white;
}
.cta-btn.secondary:hover {
  background: rgba(255,255,255,0.25);
  transform: translateY(-3px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.stat-item {
  background: rgba(255,255,255,0.12);
  padding: 1.25rem 1.75rem;
  border-radius: 14px;
  min-width: 130px;
  transition: transform 0.3s ease, background 0.3s ease;
}
.stat-item:hover {
  transform: translateY(-6px);
  background: rgba(255,255,255,0.2);
}

.stat-number {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}
.stat-label {
  font-size: 0.95rem;
  opacity: 0.9;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(6px);
  cursor: pointer;
  animation: bounce 2s infinite;
}

.scroll-indicator i {
  font-size: 1.4rem;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translate(-50%, 0); }
  40% { transform: translate(-50%, -18px); }
  60% { transform: translate(-50%, -8px); }
}

/* Animations */
.animate-up { animation: fadeInUp 1s ease-out; }
.animate-fade { animation: fadeIn 1.5s ease-out; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>