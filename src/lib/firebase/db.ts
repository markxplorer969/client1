import 'server-only';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase/admin';

// Helper: Convert Firestore Timestamp to Date
export const toDate = (timestamp: Timestamp | Date | any): Date => {
  if (!timestamp) return new Date();
  
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Handle seconds/nanoseconds object format if necessary
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }

  return new Date();
};

// Helper: Convert to Firestore Timestamp or Date
// FIX: Menggunakan FieldValue.serverTimestamp()
export const toTimestamp = (date: Date | Timestamp | any) => {
  if (date instanceof Timestamp) {
    return date;
  }
  
  if (date instanceof Date) {
    return Timestamp.fromDate(date);
  }
  
  // Jika tidak ada tanggal, gunakan Server Timestamp
  return FieldValue.serverTimestamp();
};

// --- CRUD Helpers (Contoh sederhana) ---

export const getCollection = async (collectionName: string) => {
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getDocument = async (collectionName: string, id: string) => {
  const doc = await db.collection(collectionName).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Helper untuk menambah user (jika digunakan di middleware/auth.ts)
export const userAdd = async (userData: any) => {
    const { uid, ...data } = userData;
    await db.collection('users').doc(uid).set({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
};

// Helper untuk mengedit user
export const userEdit = async (uid: string, data: any) => {
    await db.collection('users').doc(uid).update({
        ...data,
        updatedAt: FieldValue.serverTimestamp()
    });
};

export const getUser = async (uid: string) => {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return null;
    return { uid: doc.id, ...doc.data() };
};