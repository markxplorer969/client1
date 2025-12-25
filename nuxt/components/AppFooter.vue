<template>
  <footer class="app-footer">
    <div class="footer-container">
      <!-- Bagian Atas -->
      <div class="footer-top">
        <!-- Kolom 1: Tentang -->
        <div class="footer-col about-col">
          <h3 class="footer-title">{{ appTitle }}</h3>
          <p class="footer-description">{{ appDescription }}</p>
          <div class="social-links">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon"
              :aria-label="social.name"
            >
              <i :class="social.icon"></i>
            </a>
          </div>
        </div>

        <!-- Kolom 2: Tautan -->
        <div class="footer-col links-col">
          <h3 class="footer-title">Tautan Cepat</h3>
          <ul class="footer-links">
            <li v-for="(link, index) in quickLinks" :key="index">
              <NuxtLink :to="link.path" class="footer-link">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Kolom 3: Kontak -->
        <div class="footer-col contact-col">
          <h3 class="footer-title">Hubungi Kami</h3>
          <ul class="contact-info">
            <li v-for="(contact, index) in contacts" :key="index">
              <i :class="contact.icon"></i>
              <span>{{ contact.value }}</span>
            </li>
          </ul>
        </div>

        <!-- Kolom 4: Newsletter -->
        <div class="footer-col newsletter-col" v-if="showNewsletter">
          <h3 class="footer-title">Berlangganan</h3>
          <p>Dapatkan update terbaru dari kami</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input
              type="email"
              v-model="email"
              placeholder="Alamat email Anda"
              required
              class="newsletter-input"
            >
            <button type="submit" class="newsletter-btn">
              <i class="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      </div>

      <!-- Bagian Bawah -->
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ currentYear }} {{ appTitle }}. All rights reserved.
        </div>
        <div class="footer-menu">
          <NuxtLink
            v-for="(item, index) in footerMenu"
            :key="index"
            :to="item.path"
            class="footer-menu-link"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const appTitle = 'Nama Aplikasi'
const appDescription = 'Deskripsi singkat tentang aplikasi atau perusahaan Anda.'
const currentYear = new Date().getFullYear()
const email = ref('')
const showNewsletter = true

const quickLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Tentang Kami', path: '/about' },
  { name: 'Produk', path: '/products' },
  { name: 'Blog', path: '/blog' },
  { name: 'Kontak', path: '/contact' }
]

const socialLinks = [
  { name: 'Facebook', url: '#', icon: 'bi bi-facebook' },
  { name: 'Twitter', url: '#', icon: 'bi bi-twitter' },
  { name: 'Instagram', url: '#', icon: 'bi bi-instagram' },
  { name: 'LinkedIn', url: '#', icon: 'bi bi-linkedin' },
  { name: 'YouTube', url: '#', icon: 'bi bi-youtube' }
]

const contacts = [
  { icon: 'bi bi-geo-alt-fill', value: 'Jl. ambatukan' },
  { icon: 'bi bi-telephone-fill', value: '+62 813 5912 3789' },
  { icon: 'bi bi-envelope-fill', value: 'yilzi@owner.com' }
]

const footerMenu = [
  { name: 'Kebijakan Privasi', path: '/privacy' },
  { name: 'Syarat & Ketentuan', path: '/terms' },
  { name: 'Peta Situs', path: '/sitemap' }
]

const subscribeNewsletter = () => {
  console.log('Subscribed with email:', email.value)
  email.value = ''
}
</script>

<style scoped>
.app-footer {
  background: linear-gradient(145deg, #1e1e1e, #111);
  color: #f0f0f0;
  padding: 4rem 0 1.5rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-top {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2.5rem;
  margin-bottom: 3rem;
}

.footer-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background: #4eacff;
}

.footer-description {
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  color: #fff;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: #4eacff;
  transform: translateY(-4px);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: #bbb;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: #4eacff;
  transform: translateX(4px);
}

.contact-info {
  list-style: none;
  padding: 0;
}

.contact-info li {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #bbb;
}

.contact-info i {
  margin-right: 0.6rem;
  color: #4eacff;
}

.newsletter-form {
  display: flex;
  margin-top: 1rem;
  background: rgba(255,255,255,0.08);
  border-radius: 6px;
  overflow: hidden;
}

.newsletter-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border: none;
  background: transparent;
  color: #fff;
  outline: none;
}

.newsletter-input::placeholder {
  color: #aaa;
}

.newsletter-btn {
  background: #4eacff;
  border: none;
  padding: 0 1rem;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s ease;
}

.newsletter-btn:hover {
  background: #3a8fd9;
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
  color: #aaa;
}

.footer-menu {
  display: flex;
  gap: 1.25rem;
}

.footer-menu-link {
  color: #bbb;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-menu-link:hover {
  color: #4eacff;
}

/* Responsif */
@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  .footer-menu {
    justify-content: center;
  }
}
</style>
