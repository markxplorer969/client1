<template>
  <div class="error-page">
    <!-- Video Background -->
    <div class="video-background">
      <video autoplay muted loop playsinline>
        <source src="/videos/hero-bg.mp4" type="video/mp4">
      </video>
      <div class="video-overlay"></div>
    </div>

    <!-- Navigation -->
    <nav class="error-nav" :class="{ 'scrolled': isScrolled }">
      <div class="nav-container">
        <h1 class="nav-title">
          <a @click.prevent="$router.push('/')" class="back-link">
            <i class="bi bi-arrow-left"></i>
            <span>Back</span>
          </a>
        </h1>
        <Theme />
      </div>
    </nav>

    <!-- Main Content -->
    <main class="error-container">
      <div class="error-card">
        <div class="error-content">
          <!-- Animated 404 number -->
          <div class="error-number">
            <span>4</span>
            <div class="zero">
              <div class="inner-circle"></div>
            </div>
            <span>4</span>
          </div>

          <h2 class="error-title">Page Not Found</h2>
          
          <p class="error-message">
            Oops! The page you're looking for has vanished into the digital void.
          </p>
          
          <div class="error-actions">
            <button @click="$router.push('/')" class="home-button">
              <i class="bi bi-house-door"></i> Return Home
            </button>
            
            <a href="https://t.me/yilziii" target="_blank" class="contact-button">
              <i class="bi bi-telegram"></i> Contact Owner
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Page Not Found' })

import { usePageEffects } from '@/composables/usePageEffects'
const { isScrolled } = usePageEffects()

// Play video on mount
onMounted(() => {
  const video = document.querySelector('.video-background video') as HTMLVideoElement
  if (video) {
    video.play().catch(error => {
      console.log('Video autoplay prevented:', error)
    })
  }
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  position: relative;
}

/* Video Background */
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.video-background video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

/* Navigation */
.error-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.error-nav.scrolled {
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2d3748;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #4a5568;
}

.back-link i {
  font-size: 1.1rem;
}

/* Main Content */
.error-container {
  padding-top: 80px;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 100%;
  max-width: 600px;
  margin: 2rem;
  animation: fadeIn 0.6s ease-out;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.error-content {
  padding: 3rem 2rem;
  text-align: center;
}

/* 404 Number Animation */
.error-number {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
}

.error-number span {
  font-size: 8rem;
  font-weight: 800;
  color: #2d3748;
  line-height: 1;
  animation: bounce 1s ease infinite alternate;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-number span:first-child {
  animation-delay: 0.1s;
}

.error-number span:last-child {
  animation-delay: 0.2s;
}

.zero {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
  animation: float 3s ease-in-out infinite;
}

.inner-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.home-button, .contact-button {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 1rem;
}

.home-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
}

.contact-button {
  background: white;
  color: #2d3748;
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-decoration: none;
}

.contact-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-20px); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

/* Responsive */
@media (max-width: 768px) {
  .error-number span {
    font-size: 5rem;
  }
  
  .zero {
    width: 80px;
    height: 80px;
  }
  
  .inner-circle {
    width: 50px;
    height: 50px;
  }
  
  .error-message {
    max-width: 100%;
  }
  
  .error-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .home-button, .contact-button {
    width: 100%;
    justify-content: center;
  }
}
</style>