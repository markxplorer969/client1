import { ofetch } from 'ofetch'

export default defineNuxtPlugin(() => {
   const config = useRuntimeConfig()

   const api = ofetch.create({
      baseURL: config.public.baseURL as string,
      headers: {
         Accept: 'application/json'
      },
      onRequest({ options }) {
         const cookie = useCookie<{ token: string; type: string } | null>('session_token')
         const token = cookie.value?.token ?? ''

         if (token) {
            const headers = new Headers(options.headers as HeadersInit)
            headers.set('Authorization', `Bearer ${token}`)
            options.headers = headers
         }
      }
   })

   return {
      provide: { api }
   }
})