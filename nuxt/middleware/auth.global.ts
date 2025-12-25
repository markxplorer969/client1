import { useCookie } from '#app'
import { defineNuxtRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
   if (process.server) return

   const session = useCookie<{ token: string, type: string } | null>('session_token')
   const token = session.value?.token
   const type = session.value?.type

   if (to.path.startsWith('/dashboard') && !token) {
      return navigateTo('/login')
   }

   if (to.path.startsWith('/login') && token) {
      return navigateTo('/dashboard')
   }

   if (type !== 'admin' && token) {
      if (
         to.path.startsWith('/dashboard/products') ||
         to.path.startsWith('/dashboard/product') ||
         to.path.startsWith('/dashboard/add-product')
      ) {
         return navigateTo('/dashboard')
      }
   }
})
