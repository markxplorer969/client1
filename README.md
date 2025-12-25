# 📖 Dokumentasi Lengkap — Shop Website v1.0.0 (Extended 10x)

## 📌 1. Deskripsi Proyek - Detail Mendalam

Website ini adalah platform e-commerce modern berbasis **Nuxt.js 3** (Frontend) dengan **Node.js/Express.js** (Backend) yang dirancang untuk skalabilitas dan performa tinggi.

### 🎯 Fitur Utama:

* **Autentikasi Multi-Provider**: Google OAuth, sistem login tradisional, dan potensi integrasi provider lain.
* **Sistem Pembayaran Terintegrasi**: Dukungan tiga gateway pembayaran terkemuka (Xendit, Tripay, Midtrans).
* **Manajemen Produk Lengkap**: Kategori, variasi produk, inventory tracking, dan sistem review.
* **Keranjang Cerdas**: Penyimpanan multi-device, wishlist, dan abandoned cart recovery.
* **Dashboard Admin**: Analytics, manajemen order, dan kontrol inventori.
* **Optimasi SEO**: SSR native, meta tags dinamis, dan struktur data terorganisir.
* **Responsive Design**: Mobile-first approach dengan UX yang dioptimalkan.

### 🏗️ Arsitektur Teknis

```
shop-website/
├── nuxt/                          # Frontend Nuxt.js 3
│   ├── assets/                    # Global assets (CSS, images, fonts)
│   ├── components/                # Komponen Vue yang dapat digunakan kembali
│   │   ├── ui/                    # Komponen UI dasar (Button, Modal, etc.)
│   │   ├── products/              # Komponen terkait produk
│   │   ├── cart/                  # Komponen terkait keranjang
│   │   └── checkout/              # Komponen terkait checkout
│   ├── composables/               # Composables Nuxt 3 (state management)
│   ├── layouts/                   # Layout aplikasi
│   │   └── default.vue            # Layout utama
│   ├── middleware/                # Middleware untuk auth dan guards
│   ├── pages/                     # Halaman aplikasi
│   │   ├── index.vue               # Homepage
│   │   ├── products/               # Halaman produk
│   │   ├── cart.vue                # Keranjang belanja
│   │   ├── checkout.vue            # Proses checkout
│   │   ├── auth/                   # Autentikasi
│   │   └── admin/                  # Dashboard admin
│   ├── plugins/                   # Plugin Nuxt
│   ├── public/                    # Assets public
│   ├── stores/                    # State management (Pinia)
│   │   ├── useCart.ts             # Store untuk keranjang
│   │   ├── useAuth.ts             # Store untuk autentikasi
│   │   └── useProducts.ts         # Store untuk produk
│   ├── utils/                     # Utility functions
│   └── nuxt.config.ts             # Konfigurasi Nuxt
├── server/                        # Backend Node.js/Express
│   ├── controllers/               # Logic handlers untuk routes
│   ├── middleware/                # Custom middleware
│   ├── models/                    # Model database MongoDB
│   ├── routes/                    # API routes
│   ├── services/                  # Business logic
│   ├── utils/                     # Utilities dan helpers
│   ├── app.js                      # Aplikasi Express utama
│   └── index.js                    # Entry point server
├── docs/                          # Dokumentasi tambahan
├── .env.example                    # Template environment variables
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependensi project
├── vercel.json                     # Konfigurasi deployment Vercel
└── README.md                      # Dokumentasi utama
```

## 📌 2. Konfigurasi Environment Variables (Lengkap)

Buat file `.env` di root project berdasarkan `.env.example`:

```env
### Server Configuration
NODE_ENV=development
PORT=3000
TZ='Asia/Jakarta'
BASE_URL='http://localhost:3000'
FRONTEND_URL='http://localhost:3000'
ADMIN_EMAIL='your_admin@gmail.com'

### Security
JWT_SECRET='your-super-secret-jwt-key-min-32-chars'
JWT_REFRESH_SECRET='your-refresh-token-secret-even-longer'
BCRYPT_SALT_ROUNDS=12
REQUEST_LIMIT=10
CORS_ORIGINS='http://localhost:3000,https://yourdomain.com'

### Database
MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/dbname'
MONGODB_URI_TEST='mongodb://localhost:27017/test-db'

### Payment Gateways
PAYMENT_GATEWAY='tripay'  # xendit | tripay | midtrans

# Xendit Configuration
XENDIT_APIKEY='xendit_secret_api_key'
XENDIT_CALLBACK_TOKEN='xendit_callback_token'

# Tripay Configuration
TRIPAY_APIKEY='tripay_api_key'
TRIPAY_PRIVATE_KEY='tripay_private_key'
TRIPAY_MERCHANT_ID='tripay_merchant_id'
TRIPAY_CALLBACK_SECRET='tripay_callback_secret'

# Midtrans Configuration
MIDTRANS_SERVER_KEY='midtrans_server_key'
MIDTRANS_CLIENT_KEY='midtrans_client_key'
MIDTRANS_MERCHANT_ID='midtrans_merchant_id'

### Business Configuration
TAX=1.50
SHIPPING_COST=5.00
FREE_SHIPPING_MINIMUM=100.00
CURRENCY='IDR'
STORE_NAME='Your Store Name'
STORE_EMAIL='store@yourdomain.com'
STORE_PHONE='+62123456789'

### Google OAuth
GOOGLE_CLIENT_ID='your-google-client-id.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET='your-google-client-secret'

### Email Service (Optional)
EMAIL_SERVICE='gmail'  # gmail | sendgrid | mailgun
EMAIL_USER='your_email@gmail.com'
EMAIL_PASSWORD='your_email_password'
SENDGRID_API_KEY='your_sendgrid_api_key'
MAILGUN_API_KEY='your_mailgun_api_key'
MAILGUN_DOMAIN='your_mailgun_domain'

### File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES='image/jpeg,image/png,image/webp'

### Cache
REDIS_URL='redis://localhost:6379'
CACHE_TTL=3600  # 1 hour in seconds

### Monitoring (Optional)
SENTRY_DSN='your_sentry_dsn'
LOG_LEVEL='info'
```

## 📌 3. Panduan Mendapatkan API Keys (Detail)

* **Google OAuth Client ID & Secret**: Google Cloud Console → APIs & Services → Credentials → OAuth client ID.
* **MongoDB Atlas Setup**: MongoDB Atlas → Build Database → Connect your application.
* **Xendit API Key**: xendit.co → Settings → API Keys → Generate.
* **Tripay API Key**: tripay.co.id → Dashboard → Pengaturan → API → Generate.
* **Midtrans API Key**: midtrans.com → Dashboard → Settings → Access Keys → Server & Client Key.

## 📌 4. Customisasi Branding (Lengkap)

### A. Konfigurasi Dasar - `nuxt/nuxt.config.ts`

```ts
export default defineNuxtConfig({
  app: { head: { title: 'Nama Toko Anda', titleTemplate: '%s - Nama Toko Anda', meta: [ ... ] } },
  css: ['~/assets/css/main.css','~/assets/css/typography.css','~/assets/css/utilities.css'],
  modules: ['@pinia/nuxt','@nuxtjs/google-fonts','nuxt-icon'],
  googleFonts: { families: { 'Inter':[400,500,600,700],'Open+Sans':[400,600,700] } },
  runtimeConfig: { public: { baseURL: process.env.BASE_URL, googleClientId: process.env.GOOGLE_CLIENT_ID, paymentGateway: process.env.PAYMENT_GATEWAY } }
})
```

### B. Customisasi Tema Warna - `nuxt/assets/css/main.css`

```css
:root { --color-primary:#3b82f6; --color-primary-dark:#2563eb; --color-primary-light:#93c5fd; ... }
.dark { --color-primary:#60a5fa; --color-primary-dark:#3b82f6; }
```

### C. Customisasi Komponen - `nuxt/components/ui/Button.vue`

```vue
<template>
  <button :class="['btn',`btn-${variant}`,`btn-${size}`,{ 'btn-disabled': disabled, 'btn-loading': loading }]" :disabled="disabled || loading" @click="$emit('click',$event)">
    <span v-if="loading" class="btn-spinner"></span>
    <slot v-else></slot>
  </button>
</template>
<script setup>
defineProps({ variant:{type:String,default:'primary',validator:(v)=>['primary','secondary','outline','ghost','danger'].includes(v)}, size:{type:String,default:'md',validator:(v)=>['sm','md','lg','xl'].includes(v)}, disabled:Boolean, loading:Boolean })
defineEmits(['click'])
</script>
<style scoped> .btn { display:inline-flex; ... } .btn-primary{ background-color:var(--color-primary); color:white; } .btn-primary:hover{ background-color:var(--color-primary-dark);} </style>
```

## 📌 5. Deployment Guide (Lengkap)

* **Deployment ke Vercel**: `vercel login`, `vercel --prod`, konfigurasi `vercel.json`.
* **Deployment ke VPS/Cloud**: Install Node.js, PM2, Nginx, MongoDB, setup firewall, build aplikasi, start dengan PM2.
* **Deployment dengan Docker**: Dockerfile multi-stage, docker-compose.yml, `docker-compose up -d`.

## 📌 6. Maintenance & Monitoring

* **Backup Routine**: `mongodump` + rotate backup.
* **Monitoring**: PM2 logrotate, `pm2 monit`, health check endpoint.
* **Update & Rollback**: git pull → npm install → npm run build → pm2 restart.

## 📌 7. Keamanan (Security Checklist)

* **Server**: Update rutin, firewall, fail2ban, SSH keys.
* **Application**: Input validation, XSS protection, rate limiting, HTTPS, secure headers.
* **Data Protection**: Encrypt sensitive data, bcrypt passwords, mask logs, security audits.

## 📌 8. Troubleshooting Common Issues

* **Database**: Periksa status MongoDB, format connection string, firewall.
* **Build Errors**: Hapus node\_modules, package-lock.json, npm install, Node.js 18+.
* **Payment Gateway**: Callback URL benar, firewall/nginx izinkan request, signature verification.

## 📌 9. Support & Resources

* **Dokumentasi**: Nuxt.js, MongoDB, Express.js, Vercel.
* **Komunitas**: Discord Nuxt.js, Stack Overflow, GitHub Issues.
* **Monitoring Tools**: Sentry, LogRocket, Google Analytics.

## 📌 10. Changelog & Updates

* **v1.0.0**: Initial release, basic e-commerce, 3 payment gateways, Google OAuth, responsive design.
* **v1.1.0** (Upcoming): Advanced filters, wishlist, reviews, abandoned cart, email notifications, advanced admin dashboard.

## 📌 11. Kontak Developer

* **👨‍💻 Yilzi - Full Stack Developer**
* Email: [hello@yilziii.com](mailto:hello@yilziii.com)
* Website: [https://yilziii.com](https://yilziii.com)
* Telegram: @Yilziii
* GitHub: [https://github.com/YilziiHCT](https://github.com/YilziiHCT)
* LinkedIn: Yilzi Stelar
* Jam Response: Senin - Jumat 09:00-18:00 WIB, Weekend via appointment
* Support Terms: Bug fixes 30 hari, feature request case-by-case, custom development rate terpisah

## 📌 12. Lisensi

**MIT License**

* Copyright (c) 2025 Yilzi
* Izin diberikan untuk penggunaan bebas dengan syarat menyertakan hak cipta dan izin ini.
* Disediakan "AS IS" tanpa jaminan.
* Dilarang menjual ulang codebase tanpa modifikasi signifikan.
* Attribution sangat dihargai.
* Enterprise: hubungi untuk licensing terms.
# client1
# client1
