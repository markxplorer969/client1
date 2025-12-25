<template>
   <!-- 
      Wadah utama untuk menengahkan konten secara vertikal dan horizontal.
      Kelas-kelas ini berasal dari Bootstrap 5.
    -->
   <div class="d-flex align-items-center justify-content-center">

      <div class="container">
         <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-5">

               <!-- Judul Aplikasi & Subjudul -->
               <div class="text-center mb-4">
                  <!-- Menggunakan kelas .main-title dari CSS Anda -->
                  <h1 class="main-title mb-1">Selamat Datang</h1>
                  <!-- Menggunakan kelas utilitas .text-secondary yang warnanya diatur di CSS Anda -->
                  <p class="text-secondary">Masuk untuk melakukan pembelian produk</p>
               </div>

               <!-- 
              Kartu Konten Utama.
              Menggunakan kelas .content-card dari CSS Anda, yang secara otomatis
              mengatur background, border, dan warna teks untuk mode terang/gelap.
            -->
               <div class="content-card">
                  <div class="card-body p-4 p-md-5">

                     <!-- Elemen untuk menampilkan pesan galat -->
                     <div v-if="errorMessage" class="alert alert-danger text-center mb-4">
                        {{ errorMessage }}
                     </div>

                     <!-- Tombol Google Sign-In akan dirender di sini -->
                     <div id="googleSignInBtn" class="d-flex justify-content-center"></div>

                  </div>
               </div>

            </div>
         </div>
      </div>

   </div>
</template>

<script setup lang="ts">
// Mengimpor hook dari Nuxt 3 dan Vue
import { ref, onMounted } from 'vue';
import { navigateTo } from '#app';

useHead({ title: 'Login' })

// Mengakses runtime config untuk variabel lingkungan sisi klien
const config = useRuntimeConfig();
const { setAuth } = useAuth()
const { $api } = useNuxtApp();


const errorMessage = ref('');

/**
 * Menangani callback login dari Google.
 * Mengirimkan token ke backend untuk verifikasi dan otentikasi.
 * @param {any} response - Objek respons yang disediakan oleh Google.
 */
const handleLogin = async (response: any) => {
   try {
      const json = await $api('/api/v1/login', {
         method: 'POST',
         body: {
            token: response.credential
         }
      });

      if (json.status) {
         setAuth({ token: json.data.token, type: json.data.type })
         navigateTo('/dashboard');
      } else {
         // Menampilkan pesan galat dari server
         errorMessage.value = json.msg || 'Terjadi galat saat mencoba masuk.';
      }
   } catch (e: any) {
      console.error('Login Error:', e);
      errorMessage.value = e.message || 'Tidak dapat terhubung ke server.';
   }
}

// Hook onMounted dijalankan setelah komponen dirender di sisi klien
onMounted(() => {
   // Memeriksa apakah pustaka Google sudah dimuat untuk menghindari galat
   if (typeof window.google === 'undefined') {
      errorMessage.value = 'Gagal memuat layanan Google. Silakan segarkan halaman.';
      return;
   }

   try {
      // Inisialisasi Layanan Identitas Google
      window.google.accounts.id.initialize({
         // Mengambil client_id dari runtime config yang diekspos secara publik
         client_id: config.public.googleClientId,
         callback: handleLogin
      });

      // Merender tombol Google Sign-In
      window.google.accounts.id.renderButton(
         document.getElementById('googleSignInBtn'),
         // Kustomisasi tampilan tombol
         { theme: 'outline', size: 'large' }
      );
   } catch (e: any) {
      console.error('Google Sign-In Init Error:', e);
      errorMessage.value = 'Gagal menginisialisasi Google Sign-In.';
   }
});
</script>
