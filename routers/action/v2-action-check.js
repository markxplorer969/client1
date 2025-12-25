import { Database, Payment } from '../../lib/index.js'
const processingInvoices = new Set()

export const routes = {
   category: 'v1',
   path: '/api/v1/check',
   parameter: ['id'],
   method: 'post',
   execution: async (req, res, next) => {
      const { id } = req.body

      if (processingInvoices.has(id)) {
         return res.status(429).json({
            creator: global.creator,
            status: false,
            msg: 'Pengecekan untuk invoice ini sedang berlangsung. Harap tunggu sebentar.'
         })
      }

      try {
         processingInvoices.add(id)
         const iv = await Database.getInvoice(id)
         if (!iv.status) return res.status(404).json(iv)
         if (iv.data.status === 'Paid') return res.json({ status: true, msg: 'Invoice sudah lunas.' })

         const paymentResult = await Payment.checkPayment(iv.data.receipt)
         if (!paymentResult.status) return res.json(paymentResult)

         // --- Untuk Simulasi (Gunakan ini untuk testing) ---
         // `await new Promise` akan benar-benar MENUNGGU sebelum melanjutkan.
         // await new Promise(resolve => setTimeout(resolve, 5000))

         await Database.invoiceUpdate(id, { status: 'Paid' }) 

         for (let item of iv.data.items) {
            await Database.productIncrementSales(item.id, item.quantity)

            // Logika pengiriman email bisa diletakkan di sini
            const productRes = await Database.getProductWithFile(item.id)
            if (productRes.status && productRes.data.file) {
               // const downloadLink = productRes.data.file.data
               // const userEmail = iv.data.email
               // await EmailService.send(userEmail, downloadLink)
            }
         }

         res.json({
            creator: global.creator,
            status: true,
            msg: 'Pembayaran berhasil dikonfirmasi.'
         })
      } catch (e) {
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message || 'Terjadi kesalahan pada server!'
         })
      } finally {
         processingInvoices.delete(id)
      }
   },
   error: false
}