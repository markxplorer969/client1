<template>
  <div class="app-container">
    <!-- Navbar untuk Home Page -->
    <nav class="main-navbar" v-if="isHomePage" :class="{ 'scrolled': isScrolled }">
      <div class="navbar-container">
        <h1 class="main-title">{{ pageTitle }}</h1>
        <div class="navbar-actions">
          <div class="desktop-links">
            <ul class="nav-links">
              <template v-for="link in navLinks" :key="link.text">
                <li v-if="shouldShowLink(link)">
                  <a :href="link.href" v-if="isExternalLink(link.href)" class="nav-link" target="_blank">{{ link.text }}</a>
                  <a v-else class="nav-link" @click.prevent="$router.push(link.href)">
                    {{ link.text }}
                  </a>
                </li>
              </template>
              <li v-if="isLogin">
                <a class="nav-link logout-link" @click.prevent="logout">Logout</a>
              </li>
            </ul>
          </div>
          <Theme />
          <button class="mobile-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar"
            aria-controls="mobileSidebar" aria-label="Toggle menu">
            <i class="bi bi-list"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- Navbar untuk Non-Home Page -->
    <nav class="main-navbar" v-if="!isHomePage" :class="{ 'scrolled': isScrolled }">
      <div class="navbar-container">
        <h1 class="main-title back-title">
          <a @click.prevent="$router.back()">
            <i class="bi bi-arrow-left"></i>
            <span>{{ pageTitle }}</span>
          </a>
        </h1>
        <div class="navbar-actions">
          <div class="desktop-links">
            <ul class="nav-links">
              <template v-for="link in navLinks" :key="link.text">
                <li v-if="shouldShowLink(link)">
                  <a :href="link.href" v-if="isExternalLink(link.href)" class="nav-link" target="_blank">{{ link.text }}</a>
                  <a v-else class="nav-link" @click.prevent="$router.push(link.href)">
                    {{ link.text }}
                  </a>
                </li>
              </template>
              <li v-if="isLogin">
                <a class="nav-link logout-link" @click.prevent="logout">Logout</a>
              </li>
            </ul>
          </div>
          <Theme />
          <button class="mobile-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar"
            aria-controls="mobileSidebar" aria-label="Toggle menu">
            <i class="bi bi-list"></i>
          </button>
        </div>
      </div>
    </nav>

            <!-- Mobile Sidebar -->
    <div ref="mobileSidebarRef" class="offcanvas offcanvas-start" tabindex="-1" id="mobileSidebar"
      aria-labelledby="mobileSidebarLabel">
      <div class="offcanvas-header border-bottom bg-gray-100">
        <h5 class="m-0 fw-bold text-gray-800">📌 Menu</h5>
        <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column p-0 bg-gray-50">
        <!-- Cover -->
        <div class="sidebar-cover position-relative">
          <video autoplay muted loop playsinline class="cover-video w-100">
            <source src="/public/videos/db1.mp4" type="video/mp4" />
          </video>
          <div class="cover-overlay"></div>
          <div class="cover-text">
            <h2>✨ Welcome!</h2>
            <p class="m-0">Pilih menu di bawah ini</p>
          </div>
        </div>

        <!-- Links -->
        <ul class="mobile-links list-unstyled mt-3 flex-grow-1 px-2">
          <template v-for="link in navLinks" :key="link.text">
            <li v-if="shouldShowLink(link)" class="mb-2">
              <a :href="link.href" v-if="isExternalLink(link.href)"
                class="mobile-link text-decoration-none d-flex align-items-center" target="_blank">
                <i class="bi bi-arrow-up-right-square me-2"></i> {{ link.text }}
              </a>
              <a v-else class="mobile-link text-decoration-none d-flex align-items-center"
                @click.prevent="handleMobileLinkClick(link.href)">
                <i class="bi bi-chevron-right me-2"></i> {{ link.text }}
              </a>
            </li>
          </template>
          <li v-if="isLogin" class="mt-2">
            <a class="mobile-link logout-link text-decoration-none d-flex align-items-center"
              @click.prevent="logout">
              <i class="bi bi-box-arrow-right me-2"></i> Logout
            </a>
          </li>
        </ul>

        <!-- Footer -->
        <div class="sidebar-footer mt-auto text-center py-3 border-top bg-gray-100">
          <a href="https://yilzidev.tech/products" target="_blank" class="footer-link text-decoration-none">
            <span>🚀 Buy Script</span>
          </a>
          <p class="small text-muted m-0 mt-2">© 2025 YilziDev</p>
        </div>
      </div>
    </div> 


    <!-- Main Content -->
    <main class="main-content">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig, useNuxtApp, useRoute, useRouter } from '#app'
import { computed, ref, onMounted, type Ref } from 'vue'
import { usePageEffects } from '@/composables/usePageEffects'
import { useAuth } from '@/composables/useAuth'
import { Offcanvas } from 'bootstrap'

const config = useRuntimeConfig()
const title = config.public.title
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const { isScrolled } = usePageEffects()
const { clearAuth, isLogin } = useAuth()
const mobileSidebarRef: Ref<Element | null> = ref(null)
let mobileSidebarInstance: Offcanvas | null = null

onMounted(() => {
  if (mobileSidebarRef.value) {
    mobileSidebarInstance = new Offcanvas(mobileSidebarRef.value)
    mobileSidebarRef.value.addEventListener('hidden.bs.offcanvas', () => {
      document.body.classList.remove('offcanvas-backdrop')
      document.body.style.overflow = ''
      const backdrop = document.querySelector('.offcanvas-backdrop')
      if (backdrop) backdrop.remove()
    })
  }
})

const navLinks = ref([
  { text: 'Beranda', href: '/' },
  { text: 'Dashboard', href: '/dashboard', requiresAuth: true },
  { text: 'Produk', href: '/products' },
  { text: 'Kontak', href: 'mailto:owner@yilziii.com' },
  { text: 'Login', href: '/login', hideWhenLoggedIn: true }
])

const isHomePage = computed(() => route.path === '/')
const pageTitle = computed(() => (isHomePage.value ? title : 'Back'))

const isExternalLink = (href: string) =>
  href.startsWith('http') || href.startsWith('mailto')

const shouldShowLink = (link: any) => {
  if (link.requiresAuth) return isLogin.value
  if (link.hideWhenLoggedIn) return !isLogin.value
  return true
}

const handleMobileLinkClick = (href: string) => {
  if (mobileSidebarInstance) {
    mobileSidebarInstance.hide()
    setTimeout(() => {
      router.push(href)
    }, 300)
  } else {
    router.push(href)
  }
}

const logout = async () => {
  if (mobileSidebarInstance) {
    mobileSidebarInstance.hide()
  }
  try {
    await $api('/api/v1/logout', { method: 'POST' })
    clearAuth()
    setTimeout(() => {
      router.push('/login')
    }, 300)
  } catch (err) {
    console.error('Logout gagal:', err)
  }
}
</script>

<style scoped>
/* Base Styles */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.main-navbar.scrolled {
  background-color: rgba(0, 0, 0, 0.98);
  box-shadow: 0 4px 15px rgba(1, 28, 58, 0.1);
}
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.main-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  transition: all 0.3s ease;
}
.back-title a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.back-title i {
  font-size: 1.25rem;
}
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.desktop-links {
  display: none;
}
.nav-links {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}
.nav-link:hover {
  color: #1a365d;
  background-color: rgba(66, 153, 225, 0.1);
}
.logout-link {
  color: #e53e3e;
}
.logout-link:hover {
  background-color: rgba(229, 62, 62, 0.1);
}
.mobile-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #4a5568;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile Sidebar */
.offcanvas {
  width: 280px;
  border-radius: 0 14px 14px 0;
  overflow: hidden;
  background: #f8f9fa; /* abu-abu soft */
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.08);
  animation: fadeInSidebar 0.3s ease;
}

@keyframes fadeInSidebar {
  from {
    opacity: 0;
    transform: translateX(-15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Cover Section */
.sidebar-cover {
  position: relative;
  height: 160px;
  border-bottom: 1px solid #e5e7eb;
}
.cover-video {
  height: 100%;
  object-fit: cover;
  filter: brightness(0.65);
}
.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(55, 65, 81, 0.9), transparent);
}
.cover-text {
  position: absolute;
  bottom: 12px;
  left: 16px;
  color: #f9fafb;
}
.cover-text h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 2px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Links */
.mobile-links .mobile-link {
  display: block;
  padding: 0.8rem 1rem;
  color: #374151;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.55rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.mobile-links .mobile-link i {
  font-size: 1.1rem;
  color: #6b7280;
}
.mobile-links .mobile-link:hover {
  background: linear-gradient(90deg, #f3f4f6, #e5e7eb);
  color: #111827;
  transform: translateX(6px) scale(1.02);
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

/* Logout */
.logout-link {
  color: #dc2626 !important;
  background: #fff5f5;
  border: 1px solid #fecaca;
}
.logout-link:hover {
  background: #fee2e2 !important;
  color: #b91c1c !important;
}

/* Footer */
.sidebar-footer {
  background: #f9fafb;
}
.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #4b5563;
  font-weight: 600;
  transition: all 0.3s ease;
}
.footer-link:hover {
  color: #111827;
}


/* Main Content */
.main-content {
  flex: 1;
  padding-top: 80px;
}

/* Responsive */
@media (min-width: 768px) {
  .desktop-links {
    display: block;
  }
  .mobile-toggle {
    display: none;
  }
}
</style>