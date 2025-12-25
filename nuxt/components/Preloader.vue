<template>
  <transition name="preloader-fade">
    <div v-if="show" class="preloader-container">
      <!-- Animated Loader -->
      <div class="preloader-content">
        <!-- Logo or Brand -->
        <div class="preloader-brand">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" fill="#3498db"/>
            <path d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36Z" fill="#ffffff"/>
          </svg>
          <h2 class="preloader-title">Yilzi Digitalz</h2>
        </div>
        
        <!-- Progress Bar -->
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        
        <!-- Loading Percentage -->
        <div class="loading-percentage">{{ progress }}%</div>
        
        <!-- Loading Status -->
        <p class="loading-status">Memuat pengalaman terbaik untuk Anda...</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const show = ref(true)
const progress = ref(0)
let interval: ReturnType<typeof setInterval> | null = null
let timeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // Simulate loading progress
  interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.floor(Math.random() * 10) + 1
      if (progress.value > 100) progress.value = 100
    } else {
      clearInterval(interval as ReturnType<typeof setInterval>)
      timeout = setTimeout(() => {
        show.value = false
      }, 500)
    }
  }, 150)
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.preloader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  flex-direction: column;
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  width: 100%;
  padding: 0 20px;
}

.preloader-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.preloader-title {
  margin-top: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.progress-track {
  width: 100%;
  height: 6px;
  background-color: #ecf0f1;
  border-radius: 3px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-bar {
  height: 100%;
  background-color: #3498db;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.loading-percentage {
  font-size: 1.25rem;
  font-weight: 600;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.loading-status {
  color: #7f8c8d;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;
}

/* Animations */
.preloader-fade-enter-active,
.preloader-fade-leave-active {
  transition: opacity 0.5s ease;
}

.preloader-fade-enter-from,
.preloader-fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .preloader-title {
    font-size: 1.25rem;
  }
  
  .loading-percentage {
    font-size: 1rem;
  }
  
  .loading-status {
    font-size: 0.8rem;
  }
}
</style>