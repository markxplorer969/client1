import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  Timestamp,
  type Query,
  type DocumentData
} from 'firebase/firestore'
import { db } from './client'
import type { User, Product, Invoice } from './types'

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  INVOICES: 'invoices'
}

// Helper: Convert Firestore Timestamp to Date
export const toDate = (timestamp: Timestamp | Date | any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  if (timestamp instanceof Date) {
    return timestamp
  }
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate()
  }
  return new Date()
}

// Helper: Convert to Firestore Timestamp or Date
export const toTimestamp = (date: Date | Timestamp | any): Timestamp | Date => {
  if (date instanceof Timestamp) {
    return date
  }
  if (date instanceof Date) {
    return Timestamp.fromDate(date)
  }
  return serverTimestamp() as any
}

// USER FUNCTIONS
export const getUser = async (email: string): Promise<{ status: boolean; data?: User; message?: string }> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, email)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return { status: false, message: 'Pengguna tidak ditemukan' }
    }

    const userData = userSnap.data() as any
    return {
      status: true,
      data: {
        id: userSnap.id,
        ...userData,
        joined_at: toDate(userData.joined_at),
        last_activity: toDate(userData.last_activity)
      }
    }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const getAllUsers = async (options: {
  query?: any
  sort?: { field: string; direction: 'asc' | 'desc' }
  limit?: number
  startAfter?: any
} = {}): Promise<{ status: boolean; data?: User[]; message?: string }> => {
  try {
    const { query: queryOpts, sort = { field: 'joined_at', direction: 'desc' }, limit: limitNum, startAfter: startAfterDoc } = options

    let q = query(collection(db, COLLECTIONS.USERS))

    if (queryOpts && Object.keys(queryOpts).length > 0) {
      Object.entries(queryOpts).forEach(([key, value]) => {
        q = query(q, where(key, '==', value))
      })
    }

    if (sort) {
      q = query(q, orderBy(sort.field, sort.direction))
    }

    if (limitNum) {
      q = query(q, limit(limitNum))
    }

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc))
    }

    const querySnapshot = await getDocs(q)
    const users = querySnapshot.docs.map(doc => {
      const userData = doc.data() as any
      return {
        id: doc.id,
        ...userData,
        joined_at: toDate(userData.joined_at),
        last_activity: toDate(userData.last_activity)
      } as User
    })

    return { status: true, data: users }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const userAdd = async (email: string, name: string, isAdmin: boolean = false): Promise<{ status: boolean; message?: string; data?: User }> => {
  try {
    const existingUser = await getUser(email)
    if (existingUser.status) {
      if (existingUser.data?.role === 'banned') {
        return { status: false, message: 'Akun Anda telah ditangguhkan' }
      }
      return { status: false, message: 'Email sudah terdaftar' }
    }

    const userRef = doc(db, COLLECTIONS.USERS, email)
    const userData: Omit<User, 'id'> = {
      email,
      name: name || 'User',
      role: isAdmin ? 'admin' : 'user',
      joined_at: new Date(),
      verified: isAdmin,
      last_activity: new Date()
    }

    await setDoc(userRef, userData)

    return { status: true, message: 'Pendaftaran berhasil', data: { id: email, ...userData } }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const userEdit = async (email: string, updateData: Partial<User>): Promise<{ status: boolean; message?: string }> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, email)

    // Don't update protected fields
    const { id, email: _, role, joined_at, ...allowedUpdates } = updateData as any
    allowedUpdates.last_activity = new Date()

    await updateDoc(userRef, allowedUpdates)
    return { status: true, message: 'Profil pengguna berhasil diperbarui' }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const userDelete = async (email: string, adminEmail: string): Promise<{ status: boolean; message?: string }> => {
  try {
    if (email === adminEmail) {
      return { status: false, message: 'Tidak dapat menghapus akun administrator utama' }
    }

    await deleteDoc(doc(db, COLLECTIONS.USERS, email))
    return { status: true, message: 'Pengguna berhasil dihapus' }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

// PRODUCT FUNCTIONS
export const getProduct = async (productId: string): Promise<{ status: boolean; data?: Product; message?: string }> => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId)
    const productSnap = await getDoc(productRef)

    if (!productSnap.exists()) {
      return { status: false, message: 'Produk tidak ditemukan' }
    }

    const productData = productSnap.data() as any
    return {
      status: true,
      data: {
        id: productSnap.id,
        ...productData,
        created_at: toDate(productData.created_at),
        updated_at: toDate(productData.updated_at)
      }
    }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const getAllProducts = async (options: {
  query?: any
  sort?: { field: string; direction: 'asc' | 'desc' }
  limit?: number
  startAfter?: any
} = {}): Promise<{ status: boolean; data?: Product[]; message?: string }> => {
  try {
    const { query: queryOpts, sort = { field: 'created_at', direction: 'desc' }, limit: limitNum, startAfter: startAfterDoc } = options

    let q = query(collection(db, COLLECTIONS.PRODUCTS))

    if (queryOpts && Object.keys(queryOpts).length > 0) {
      Object.entries(queryOpts).forEach(([key, value]) => {
        if (key === 'show' || key === 'stock_available') {
          q = query(q, where(key, '==', value))
        }
      })
    }

    if (sort) {
      q = query(q, orderBy(sort.field, sort.direction))
    }

    if (limitNum) {
      q = query(q, limit(limitNum))
    }

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc))
    }

    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(doc => {
      const productData = doc.data() as any
      return {
        id: doc.id,
        ...productData,
        created_at: toDate(productData.created_at),
        updated_at: toDate(productData.updated_at)
      } as Product
    })

    return { status: true, data: products }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const getTopProducts = async (limitCount: number = 8): Promise<{ status: boolean; data?: Product[]; message?: string }> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where('show', '==', true),
      where('stock_available', '==', true),
      orderBy('sales', 'desc'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(doc => {
      const productData = doc.data() as any
      return {
        id: doc.id,
        ...productData,
        created_at: toDate(productData.created_at),
        updated_at: toDate(productData.updated_at)
      } as Product
    })

    return { status: true, data: products }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const productAdd = async (productData: Partial<Product>): Promise<{ status: boolean; message?: string; data?: Product }> => {
  try {
    const { name, description, price, original_price, label, imageUrl, file, additional_information, stock_available, show } = productData

    if (!name || !price) {
      return { status: false, message: 'Nama dan harga produk wajib diisi' }
    }

    const newProduct: Omit<Product, 'id'> = {
      name: name!,
      description: description || '',
      price: Number(price),
      original_price: Number(original_price) || 0,
      sales: 0,
      label: label || null,
      imageUrl: imageUrl || null,
      file: file || null,
      additional_information: additional_information || [],
      stock_available: stock_available !== undefined ? stock_available : true,
      show: show !== undefined ? show : true,
      created_at: new Date(),
      updated_at: new Date()
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), newProduct)
    return { status: true, message: 'Produk berhasil ditambahkan', data: { id: docRef.id, ...newProduct } }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const productUpdate = async (productId: string, updateData: Partial<Product>): Promise<{ status: boolean; message?: string }> => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId)

    // Don't update protected fields
    const { id, created_at, ...allowedUpdates } = updateData as any
    allowedUpdates.updated_at = new Date()

    await updateDoc(productRef, allowedUpdates)
    return { status: true, message: 'Produk berhasil diperbarui' }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const productIncrementSales = async (productId: string, amount: number = 1): Promise<{ status: boolean; message?: string }> => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId)

    await updateDoc(productRef, {
      sales: increment(amount),
      updated_at: new Date()
    })

    return { status: true, message: `Penjualan produk berhasil ditambah sebanyak ${amount}` }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const productDelete = async (productId: string): Promise<{ status: boolean; message?: string }> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, productId))
    return { status: true, message: 'Produk berhasil dihapus' }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

// INVOICE FUNCTIONS
export const getInvoice = async (invoiceId: string): Promise<{ status: boolean; data?: Invoice; message?: string }> => {
  try {
    const invoiceRef = doc(db, COLLECTIONS.INVOICES, invoiceId)
    const invoiceSnap = await getDoc(invoiceRef)

    if (!invoiceSnap.exists()) {
      return { status: false, message: 'Invoice tidak ditemukan' }
    }

    const invoiceData = invoiceSnap.data() as any
    return {
      status: true,
      data: {
        id: invoiceSnap.id,
        ...invoiceData,
        created_at: toDate(invoiceData.created_at),
        paid_at: invoiceData.paid_at ? toDate(invoiceData.paid_at) : null,
        download_link_expires_at: invoiceData.download_link_expires_at ? toDate(invoiceData.download_link_expires_at) : null
      }
    }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const getAllInvoices = async (options: {
  email?: string
  sort?: { field: string; direction: 'asc' | 'desc' }
  limit?: number
  startAfter?: any
} = {}): Promise<{ status: boolean; data?: Invoice[]; message?: string }> => {
  try {
    const { email, sort = { field: 'created_at', direction: 'desc' }, limit: limitNum, startAfter: startAfterDoc } = options

    let q = query(collection(db, COLLECTIONS.INVOICES))

    if (email) {
      q = query(q, where('email', '==', email))
    }

    if (sort) {
      q = query(q, orderBy(sort.field, sort.direction))
    }

    if (limitNum) {
      q = query(q, limit(limitNum))
    }

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc))
    }

    const querySnapshot = await getDocs(q)
    const invoices = querySnapshot.docs.map(doc => {
      const invoiceData = doc.data() as any
      return {
        id: doc.id,
        ...invoiceData,
        created_at: toDate(invoiceData.created_at),
        paid_at: invoiceData.paid_at ? toDate(invoiceData.paid_at) : null,
        download_link_expires_at: invoiceData.download_link_expires_at ? toDate(invoiceData.download_link_expires_at) : null
      } as Invoice
    })

    return { status: true, data: invoices }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const invoiceAdd = async (invoiceData: Omit<Invoice, 'id' | 'created_at'>): Promise<{ status: boolean; message?: string; data?: Invoice }> => {
  try {
    const newInvoice: Omit<Invoice, 'id'> = {
      ...invoiceData,
      created_at: new Date()
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.INVOICES), newInvoice)
    return { status: true, message: 'Invoice berhasil dibuat', data: { id: docRef.id, ...newInvoice } }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const invoiceUpdate = async (invoiceId: string, updateData: Partial<Invoice>): Promise<{ status: boolean; message?: string }> => {
  try {
    const invoiceRef = doc(db, COLLECTIONS.INVOICES, invoiceId)

    // Don't update protected fields
    const { id, created_at, items, amount, ...allowedUpdates } = updateData as any

    if (allowedUpdates.status === 'Paid' && !allowedUpdates.paid_at) {
      allowedUpdates.paid_at = new Date()
    }

    await updateDoc(invoiceRef, allowedUpdates)
    return { status: true, message: 'Invoice berhasil diperbarui' }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const invoiceDelete = async (invoiceId: string): Promise<{ status: boolean; message?: string }> => {
  try {
    const invoiceRes = await getInvoice(invoiceId)
    if (!invoiceRes.status) {
      return { status: false, message: 'Invoice tidak ditemukan' }
    }

    if (invoiceRes.data?.status === 'Paid') {
      return { status: false, message: 'Tidak dapat menghapus invoice yang sudah lunas' }
    }

    await deleteDoc(doc(db, COLLECTIONS.INVOICES, invoiceId))
    return { status: true, message: 'Invoice berhasil dihapus' }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const cleanupPendingInvoices = async (): Promise<{ status: boolean; message?: string }> => {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

    const q = query(
      collection(db, COLLECTIONS.INVOICES),
      where('status', '==', 'Pending'),
      where('created_at', '<', tenMinutesAgo)
    )

    const querySnapshot = await getDocs(q)

    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)

    if (querySnapshot.size > 0) {
      console.log(`[Scheduler] Berhasil menghapus ${querySnapshot.size} invoice yang kadaluarsa.`)
    }

    return {
      status: true,
      message: `${querySnapshot.size} invoice(s) kadaluarsa berhasil dihapus.`
    }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

// Helper function for pagination
export const getPaginatedProducts = async (
  lastVisible: any = null,
  pageSize: number = 12
): Promise<{ status: boolean; data?: Product[]; lastVisible?: any; message?: string }> => {
  try {
    let q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where('show', '==', true),
      orderBy('created_at', 'desc'),
      limit(pageSize)
    )

    if (lastVisible) {
      q = query(q, startAfter(lastVisible))
    }

    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(doc => {
      const productData = doc.data() as any
      return {
        id: doc.id,
        ...productData,
        created_at: toDate(productData.created_at),
        updated_at: toDate(productData.updated_at)
      } as Product
    })

    const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]

    return { status: true, data: products, lastVisible: newLastVisible }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}
