interface Contact {
   name: string;
   url: string;
}

declare module '#app' {
   interface NuxtPublicConfig {
      contacts: Contact[]; // <-- Beri tahu TypeScript bahwa 'contacts' adalah array dari objek 'Contact'
   }
}

export { }