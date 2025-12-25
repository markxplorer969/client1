// File: types/global.d.ts

// Kita mendefinisikan tipe untuk objek Google Sign-In agar lebih spesifik
// dan mendapatkan auto-completion.
interface GoogleCredentialResponse {
   credential: any;
}

interface GoogleAccounts {
   accounts: any;
   id: {
      initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void; }) => void;
      renderButton: (parent: HTMLElement | null, options: { theme?: string; size?: string; width?: string; }) => void;
      prompt: () => void;
   };
}

// Menggunakan 'declare global' untuk memperluas tipe global yang sudah ada
declare global {
   interface Window {
      // Memberi tahu TypeScript bahwa 'window' akan memiliki properti 'google'
      google: GoogleAccounts;
   }
}

// Menambahkan 'export {}' kosong membuat file ini menjadi sebuah modul,
// yang merupakan praktik yang baik untuk file deklarasi.
export { };