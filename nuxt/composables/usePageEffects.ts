import { ref, onMounted, onUnmounted, type Ref } from 'vue'

type Theme = 'light' | 'dark'

interface UsePageEffectsReturn {
   theme: Ref<Theme>
   isScrolled: Ref<boolean>
   toggleTheme: () => void
}

export function usePageEffects(): UsePageEffectsReturn {
   const theme: Ref<Theme> = ref('dark')
   const isScrolled: Ref<boolean> = ref(false)

   const applyTheme = (newTheme: Theme) => {
      if (typeof document === 'undefined') return
      if (newTheme === 'dark') {
         document.body.classList.remove('light-mode')
      } else {
         document.body.classList.add('light-mode')
      }
      localStorage.setItem('theme', newTheme)
      theme.value = newTheme
   }

   const toggleTheme = () => {
      applyTheme(theme.value === 'dark' ? 'light' : 'dark')
   }

   const handleScroll = () => {
      if (typeof window === 'undefined') return
      isScrolled.value = window.scrollY > 10
   }

   onMounted(() => {
      const savedTheme = localStorage.getItem('theme')
      applyTheme((savedTheme === 'light' ? 'light' : 'dark') as Theme)
      window.addEventListener('scroll', handleScroll)
      handleScroll()
   })

   onUnmounted(() => {
      if (typeof window !== 'undefined') {
         window.removeEventListener('scroll', handleScroll)
      }
   })

   return {
      theme,
      isScrolled,
      toggleTheme
   }
}