import 'server-only';

import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { firebaseAdminConfig } from './config';

// Variable global untuk app instance
let app;

// Cek apakah app sudah ada untuk mencegah double initialization
if (!getApps().length) {
  app = initializeApp({
    // FIX: Tambahkan 'as any' di sini agar TypeScript tidak protes soal format snake_case vs camelCase
    credential: cert(firebaseAdminConfig as any),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
} else {
  app = getApps()[0];
}

// Inisialisasi service
const db = getFirestore(app);
const adminAuth = getAuth(app);
const storage = getStorage(app);

// Export semua instance
export { app, db, adminAuth, storage, FieldValue };