<template>
  <transition name="fade">
    <div 
      class="alert"
      :class="[alertClass, { 'with-icon': showIcon, 'dismissible': dismissible }]"
      role="alert"
      v-if="show"
    >
      <div class="alert-content">
        <span class="alert-icon" v-if="showIcon">
          <slot name="icon">
            <component :is="iconComponent" v-if="iconComponent" />
            <span v-else>{{ defaultIcon }}</span>
          </slot>
        </span>
        <div class="alert-body">
          <slot>{{ message }}</slot>
        </div>
      </div>
      <button 
        class="alert-close" 
        v-if="dismissible" 
        @click="closeAlert"
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (val) => ['info', 'danger', 'success', 'warning', 'primary', 'secondary'].includes(val),
  },
  show: {
    type: Boolean,
    default: true,
  },
  message: {
    type: String,
    default: '',
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
  timeout: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['close', 'update:show'])

const alertClass = computed(() => `alert-${props.type}`)

const defaultIcon = computed(() => {
  const icons = {
    info: 'ℹ️',
    danger: '⚠️',
    success: '✓',
    warning: '⚠️',
    primary: '★',
    secondary: '●'
  }
  return icons[props.type] || ''
})

const iconComponent = computed(() => {
  if (!props.icon) return null
  // Jika menggunakan library ikon seperti Font Awesome atau Material Icons
  // Anda bisa mengembalikan komponen ikon di sini
  return null
})

const closeAlert = () => {
  emit('update:show', false)
  emit('close')
}

// Auto-dismiss jika timeout diatur
if (props.timeout > 0) {
  setTimeout(() => {
    closeAlert()
  }, props.timeout)
}
</script>

<style scoped>
.alert {
  position: relative;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  flex-grow: 1;
}

.alert-body {
  flex-grow: 1;
}

.alert-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
  line-height: 1;
}

.alert-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  padding: 0;
  margin-left: 1rem;
}

.alert-close:hover {
  opacity: 1;
}

/* Tipe Alert */
.alert-info {
  background-color: #e6f2ff;
  border-color: #b3d7ff;
  color: #004085;
}

.alert-danger {
  background-color: #fdecea;
  border-color: #f5c2c7;
  color: #842029;
}

.alert-success {
  background-color: #e6f9f0;
  border-color: #badbcc;
  color: #0f5132;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffecb5;
  color: #664d03;
}

.alert-primary {
  background-color: #e0e7ff;
  border-color: #c7d2fe;
  color: #3730a3;
}

.alert-secondary {
  background-color: #e5e7eb;
  border-color: #d1d5db;
  color: #374151;
}

/* Animasi */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsif */
@media (max-width: 768px) {
  .alert {
    padding: 0.75rem 1rem;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .alert-close {
    align-self: flex-end;
    margin-top: -0.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>