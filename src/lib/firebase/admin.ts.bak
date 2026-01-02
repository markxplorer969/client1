import 'server-only';

import { getApps, initializeApp, cert } from 'firebase-admin/app';
// FIX: Ganti 'increment' dengan 'FieldValue'
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { firebaseAdminConfig } from './config';

// Mencegah inisialisasi ganda di hot-reload Next.js
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseAdminConfig),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

// Export instance utama
export { db, auth, storage };

// Export FieldValue agar bisa dipakai di file lain (misal: FieldValue.increment(1))
export { FieldValue };