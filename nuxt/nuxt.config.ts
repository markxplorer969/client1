export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: 'vercel-static'
  },
  devtools: { enabled: false },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'iconify-icon'
    }
  },
  vite: {
    server: {
      allowedHosts: true
    }
  },
  css: [
    '~/assets/css/style.css',
    'sweetalert2/dist/sweetalert2.min.css'
  ],
  app: {
    head: {
      title: 'Yilzi Digitalz',
      titleTemplate: '%s - Yilzi Digitalz',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'author', content: 'Yilzi Stelar' },
        { name: 'description', content: 'Website Shop resmi, khusus untuk menjual script yang di buat oleh Yilzi.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css', crossorigin: 'anonymous' }
      ],
      script: [
        { src: 'https://accounts.google.com/gsi/client', async: true, defer: true },
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', crossorigin: 'anonymous' },
      ]
    }
  },
  runtimeConfig: {
    public: {
      session_expires: 3 * 24 * 60 * 60,
      downloadLinkExpiresInHours: 1,
      title: 'Yilzi Shop',
      description: 'Website Shop resmi, khusus untuk menjual Kebutuhan Digital dari Yilzi.',
      hero: {
        title: 'Automasi & Website',
        highlight: 'Script Bot WhatsApp hingga website dengan otomatisasi proses.'
      },
      baseURL: '/',
      googleClientId: '.apps.googleusercontent.com',
      tax: 1.5,
      links: [{
        name: 'Telegram',
        url: 'https://t.me/Yilziii'
      }, {
        name: 'Yilzi Information',
        url: 'https://info.yilziii.com'
      }, {
        name: 'Helper (Portolio)',
        url: 'https://yilziii.com'
      }, {
        name: 'Script WhatsApp Bot',
        url: 'https://github.com/YilziiHCT'
      }],
      contacts: [{
        name: 'WhatsApp',
        url: 'https://wa.me/6281359123789'
      }, {
        name: 'Instagram',
        url: 'https://instagram.com/Yilzi_dominan'
      }, {
        name: 'Email',
        url: 'mailto:owner@yilziii.com'
      }]
    }
  }
})