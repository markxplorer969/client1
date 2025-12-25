import fs from 'fs/promises'
import path from 'path'
import Mongo from './system/mongo.js'
import Func from './functions.js'

class Database {
   constructor() {
      this.mongo = Mongo
   }

   /**
    * Get a single user by email or username
    * @param {string} input - User ID (email) or username
    * @returns {Promise<object>}
    */
   getUser = async (input) => {
      try {
         const usersCollection = await this.mongo.exec('users')
         const user = await usersCollection.findOne({
            $or: [{ _id: input }, { username: input }]
         })

         if (!user) throw new Error('Pengguna tidak ditemukan')
         return { creator: global.creator, status: true, data: user }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Get multiple users with filtering, projection, sorting, and pagination
    * @param {object} options
    * @returns {Promise<object>}
    */
   getAllUsers = async (options = {}) => {
      try {
         const { query = {}, projection = {}, sort = { joined_at: -1 }, limit = 0, skip = 0 } = options
         const usersCollection = await this.mongo.exec('users')

         const cursor = usersCollection
            .find(query)
            .project(projection)
            .sort(sort)
            .skip(skip)
            .limit(limit)

         const users = await cursor.toArray()
         return { creator: global.creator, status: true, data: users }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Register a new user
    * @param {string} email
    * @param {string} name
    * @returns {Promise<object>}
    */
   userAdd = async (email, name) => {
      try {
         const usersCollection = await this.mongo.exec('users')
         const userExists = await usersCollection.findOne({ _id: email })

         if (userExists) {
            if (userExists.role === 'banned') throw new Error('Akun Anda telah ditangguhkan')
            throw new Error('Email sudah terdaftar')
         }

         const isAdmin = email === process.env.ADMIN_EMAIL
         await usersCollection.insertOne({
            _id: email,
            name: name || 'User',
            role: isAdmin ? 'admin' : 'user',
            joined_at: new Date(),
            verified: isAdmin,
            last_activity: new Date()
         })
         return { creator: global.creator, status: true, msg: 'Pendaftaran berhasil' }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Edit an existing user's profile
    * @param {string} userId
    * @param {object} updateData
    * @returns {Promise<object>}
    */
   userEdit = async (userId, updateData) => {
      try {
         const user = (await this.getUser(userId)).data
         if (!user) throw new Error('Pengguna tidak ditemukan')

         delete updateData._id
         delete updateData.email
         delete updateData.role
         delete updateData.joined_at
         updateData.last_activity = new Date()

         const result = await (await this.mongo.exec('users')).updateOne(
            { _id: user._id },
            { $set: updateData }
         )

         if (result.matchedCount === 0) throw new Error('Pengguna tidak ditemukan saat pembaruan')
         if (result.modifiedCount === 0) return { creator: global.creator, status: true, msg: 'Tidak ada perubahan yang dilakukan' }

         return { creator: global.creator, status: true, msg: 'Profil pengguna berhasil diperbarui' }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Delete a user account
    * @param {string} userId
    * @returns {Promise<object>}
    */
   userDelete = async (userId) => {
      try {
         const user = (await this.getUser(userId)).data
         if (!user) throw new Error('Pengguna tidak ditemukan')
         if (user._id === process.env.ADMIN_EMAIL) throw new Error('Tidak dapat menghapus akun administrator utama')

         const result = await (await this.mongo.exec('users')).deleteOne({ _id: user._id })
         if (result.deletedCount === 0) throw new Error('Gagal menghapus pengguna')

         return { creator: global.creator, status: true, msg: 'Pengguna berhasil dihapus' }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Add a new product
    * @param {object} productData
    * @returns {Promise<object>}
    */
   productAdd = async (productData = {}) => {
      try {
         const { name, description, price, original_price, badge, imageUrl, file, additional_information, stock_available, show } = productData

         if (!name || !price) throw new Error('Nama dan harga produk wajib diisi')

         const newProduct = {
            _id: Func.makeId(4),
            name,
            description: description || '',
            price: Number(price),
            original_price: Number(original_price) || 0,
            sales: 0,
            label: badge || null,
            imageUrl: imageUrl || null,
            file: file || null,
            additional_information: additional_information || [],
            stock_available: true,
            show: true,
            created_at: new Date(),
            updated_at: new Date()
         }

         await (await this.mongo.exec('products')).insertOne(newProduct)
         return { creator: global.creator, status: true, msg: 'Produk berhasil ditambahkan', data: newProduct }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Update product details
    * @param {string} productId
    * @param {object} updateData
    * @returns {Promise<object>}
    */
   productUpdate = async (productId, updateData) => {
      try {
         if (!productId) throw new Error('Format ID Produk tidak valid')

         delete updateData._id
         delete updateData.id
         delete updateData.created_at
         updateData.updated_at = new Date()

         const result = await (await this.mongo.exec('products')).updateOne(
            { _id: productId },
            { $set: updateData }
         )

         if (result.matchedCount === 0) throw new Error('Produk tidak ditemukan')
         return { creator: global.creator, status: true, msg: 'Produk berhasil diperbarui' }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Get product by ID (without file data)
    * @param {string} productId
    * @returns {Promise<object>}
    */
   getProduct = async (productId) => {
      try {
         const options = {
            projection: {
               'file.data': 0
            }
         }

         const product = await (await this.mongo.exec('products')).findOne({ _id: productId }, options)

         if (!product) throw new Error('Produk tidak ditemukan')
         return { creator: global.creator, status: true, data: product }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Get multiple products with pagination
    * @param {object} options
    * @returns {Promise<object>}
    */
   getAllProducts = async (options = {}) => {
      try {
         const { query = {}, projection = {}, sort = { created_at: -1 }, limit = 0, skip = 0 } = options
         const finalProjection = {
            ...projection,
            'file.data': 0
         }
         const productsCollection = await this.mongo.exec('products')
         const cursor = productsCollection
            .find(query)
            .project(finalProjection)
            .sort(sort)
            .skip(skip)
            .limit(limit)

         const products = await cursor.toArray()
         return { creator: global.creator, status: true, data: products }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Get product with full file data
    * @param {string} productId
    * @returns {Promise<object>}
    */
   getProductWithFile = async (productId) => {
      try {
         const product = await (await this.mongo.exec('products')).findOne({ _id: productId })
         if (!product) throw new Error('Produk internal tidak ditemukan')
         return { creator: global.creator, status: true, data: product }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Increment product sales
    * @param {string} productId
    * @param {number} amount
    * @returns {Promise<object>}
    */
   productIncrementSales = async (productId, amount = 1) => {
      try {
         if (!productId) throw new Error('ID Produk wajib diisi')

         const result = await (await this.mongo.exec('products')).updateOne(
            { _id: productId },
            {
               $inc: { sales: amount },
               $set: { updated_at: new Date() }
            }
         )

         if (result.matchedCount === 0) throw new Error('Produk tidak ditemukan')
         return { creator: global.creator, status: true, msg: `Penjualan produk berhasil ditambah sebanyak ${amount}` }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Delete a product and its related file if exists
    * @param {string} productId
    * @returns {Promise<object>}
    */
   productDelete = async (productId) => {
      try {
         if (!productId) throw new Error('Format ID Produk tidak valid')

         const productResponse = await this.getProductWithFile(productId)
         if (!productResponse.status) throw new Error('Produk tidak ditemukan atau sudah dihapus')

         const product = productResponse.data
         if (product.file && product.file.type === 'local' && product.file.data) {
            try {
               const filePath = path.join(process.cwd(), 'public', product.file.data)
               await fs.unlink(filePath)
               console.log(`File lokal berhasil dihapus: ${filePath}`)
            } catch (fileError) {
               if (fileError.code === 'ENOENT') {
                  console.warn(`File lokal tidak ditemukan saat mencoba menghapus: ${fileError.path}. Melanjutkan proses...`)
               } else {
                  console.error(`Gagal menghapus file lokal:`, fileError)
               }
            }
         }

         const result = await (await this.mongo.exec('products')).deleteOne({ _id: productId })
         if (result.deletedCount === 0) throw new Error('Produk tidak ditemukan atau sudah dihapus')

         return { creator: global.creator, status: true, msg: 'Produk dan file terkait berhasil dihapus' }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Create a new invoice
    * @param {string} customer
    * @param {object} data
    * @returns {Promise<object>}
    */
   invoiceAdd = async (customer, data = {}) => {
      try {
         const newInvoice = {
            _id: data.id,
            email: customer || null,
            amount: data.amount || 0,
            items: data.items || [],
            qr: data.qr || null,
            va: data.va || null,
            redirect: data.redirect || null,
            status: 'Pending',
            additional_information: data.additional_information || [],
            created_at: new Date(),
            paid_at: null,
            payment_method: data.method || null,
            receipt: data.receipt || null
         }

         await (await this.mongo.exec('invoices')).insertOne(newInvoice)
         return { creator: global.creator, status: true, msg: 'Invoice berhasil dibuat', data: newInvoice }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Get an invoice by ID
    * @param {string} invoiceId
    * @returns {Promise<object>}
    */
   getInvoice = async (invoiceId) => {
      try {
         const invoice = await (await this.mongo.exec('invoices')).findOne({ _id: invoiceId })
         if (!invoice) throw new Error('Invoice tidak ditemukan')
         return { creator: global.creator, status: true, data: invoice }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Get all invoices with pagination
    * @param {object} options
    * @returns {Promise<object>}
    */
   getAllInvoices = async (options = {}) => {
      try {
         const { query = {}, sort = { created_at: -1 }, limit = 10, skip = 0 } = options
         const invoicesCollection = await this.mongo.exec('invoices')

         const cursor = invoicesCollection
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)

         const invoices = await cursor.toArray()
         const total = await invoicesCollection.countDocuments(query)

         return { creator: global.creator, status: true, data: { invoices, pagination: { total, limit, skip } } }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Update an invoice
    * @param {string} invoiceId
    * @param {object} updateData
    * @returns {Promise<object>}
    */
   invoiceUpdate = async (invoiceId, updateData) => {
      try {
         delete updateData._id
         delete updateData.items
         delete updateData.amount
         delete updateData.created_at

         if (updateData.status === 'Paid' && !updateData.paid_at) {
            updateData.paid_at = new Date()
         }

         const result = await (await this.mongo.exec('invoices')).updateOne(
            { _id: invoiceId },
            { $set: updateData }
         )

         if (result.matchedCount === 0) throw new Error('Invoice tidak ditemukan')
         return { creator: global.creator, status: true, msg: 'Invoice berhasil diperbarui' }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Delete an invoice (only if unpaid)
    * @param {string} invoiceId
    * @returns {Promise<object>}
    */
   invoiceDelete = async (invoiceId) => {
      try {
         const invoiceRes = await this.getInvoice(invoiceId)
         if (invoiceRes.status && invoiceRes.data.status === 'Paid') {
            throw new Error('Tidak dapat menghapus invoice yang sudah lunas')
         }

         const result = await (await this.mongo.exec('invoices')).deleteOne({ _id: invoiceId })
         if (result.deletedCount === 0) throw new Error('Gagal menghapus invoice')

         return { creator: global.creator, status: true, msg: 'Invoice berhasil dihapus' }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }

   /**
    * Clean up pending invoices older than 10 minutes
    * @returns {Promise<object>}
    */
   cleanupPendingInvoices = async () => {
      try {
         const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

         const query = {
            status: 'Pending',
            created_at: { $lt: tenMinutesAgo }
         }

         const invoicesCollection = await this.mongo.exec('invoices')
         const result = await invoicesCollection.deleteMany(query)

         if (result.deletedCount > 0) {
            console.log(`[Scheduler] Berhasil menghapus ${result.deletedCount} invoice yang kadaluarsa.`)
         }

         return {
            creator: global.creator,
            status: true,
            msg: `${result.deletedCount} invoice(s) kadaluarsa berhasil dihapus.`
         }
      } catch (e) {
         return { creator: global.creator, status: false, msg: e.message }
      }
   }
}

export default new Database