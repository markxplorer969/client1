<template>
  <div class="accordion custom-faq" id="faqAccordion">
    <div
      v-for="(item, index) in faqItems"
      :key="item.id"
      class="accordion-item"
    >
      <h2 class="accordion-header" :id="'heading' + item.id">
        <button
          class="accordion-button d-flex align-items-center gap-3"
          :class="{ collapsed: index !== 0 }"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="'#collapse' + item.id"
          :aria-expanded="index === 0"
          :aria-controls="'collapse' + item.id"
        >
          <!-- Ikon FAQ -->
          <span class="faq-icon-wrapper">
            <i :class="item.icon"></i>
          </span>
          <span class="faq-question">
            {{ item.question }}
          </span>
        </button>
      </h2>
      <div
        :id="'collapse' + item.id"
        class="accordion-collapse collapse"
        :class="{ show: index === 0 }"
        :aria-labelledby="'heading' + item.id"
        data-bs-parent="#faqAccordion"
      >
        <div class="accordion-body">
          {{ item.answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface FaqItem {
  id: number
  question: string
  answer: string
  icon: string
}

const faqItems = ref<FaqItem[]>([
  {
    id: 1,
    question: 'Bagaimana cara membeli produk?',
    answer:
      'Sebelum membeli produk baca deskripsi terlebih dahulu, pembelian cukup dengan mengklik tombol "Beli" lalu ikuti instruksi di layar. Jika ada kendala setelah pembayaran, segera hubungi admin.',
    icon: 'bi bi-bag-check-fill'
  },
  {
    id: 2,
    question: 'Apakah pembayaran di cek otomatis?',
    answer:
      'Ya, sistem akan mengecek pembayaran secara otomatis. Disarankan tetap berada di halaman invoice hingga status pembayaran berhasil.',
    icon: 'bi bi-shield-check'
  },
  {
    id: 3,
    question: 'Metode pembayaran apa yang digunakan?',
    answer:
      'Kami menggunakan QRIS yang fleksibel, bisa dibayar lewat bank maupun e-wallet dengan cepat dan aman.',
    icon: 'bi bi-qr-code-scan'
  }
])
</script>

<style scoped>
/* Root var (default light theme) */
.custom-faq {
  --faq-border: rgba(0, 0, 0, 0.08);
  --faq-text: #222;
  --faq-accent: #228be6;
  --faq-secondary: #555;
  --faq-bg: rgba(255, 255, 255, 0.9);
  --faq-hover: rgba(34, 139, 230, 0.08);

  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 0.5rem;
  transition: all 0.35s ease;
}

/* Dark theme override */
:global(.dark) .custom-faq {
  --faq-border: rgba(255, 255, 255, 0.15);
  --faq-text: #eaeaea;
  --faq-accent: #4dabf7;
  --faq-secondary: #bbb;
  --faq-bg: rgba(20, 20, 30, 0.6);
  --faq-hover: rgba(77, 171, 247, 0.15);
}

.accordion-item {
  background: var(--faq-bg);
  border: 1px solid var(--faq-border);
  border-radius: 14px;
  margin-bottom: 14px;
  transition: all 0.35s ease;
  overflow: hidden;
}

.accordion-item:hover {
  border-color: var(--faq-accent);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.accordion-button {
  background: transparent;
  box-shadow: none !important;
  color: var(--faq-text);
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  padding: 1.1rem 1rem;
}

.accordion-button:not(.collapsed) {
  color: var(--faq-accent);
  background: var(--faq-hover);
}

.accordion-button::after {
  filter: invert(0.6) grayscale(100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.dark) .accordion-button::after {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.accordion-button:not(.collapsed)::after {
  transform: rotate(180deg);
}

/* Ikon FAQ */
.faq-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--faq-accent), #1c7ed6);
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.accordion-button:not(.collapsed) .faq-icon-wrapper {
  transform: rotate(12deg) scale(1.1);
  box-shadow: 0 4px 12px rgba(34, 139, 230, 0.4);
}

/* Pertanyaan */
.faq-question {
  flex-grow: 1;
  text-align: left;
  font-size: 1rem;
  letter-spacing: 0.3px;
}

/* Jawaban */
.accordion-body {
  color: var(--faq-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  padding: 1rem 1.25rem;
  border-top: 1px dashed var(--faq-border);
  background: rgba(0, 0, 0, 0.02);
  animation: fadeIn 0.4s ease;
}

:global(.dark) .accordion-body {
  background: rgba(255, 255, 255, 0.02);
}

/* Animasi masuk */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
