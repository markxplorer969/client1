import { Database, Func, Payment } from '../../lib/index.js'

export const routes = {
   category: 'v1',
   path: '/api/v1/checkout',
   parameter: ['item'],
   method: 'post',
   execution: async (req, res, next) => {
      try {
         const { item, additional_information } = req.body
         
         const product = await Database.getProduct(item)
         if (!product.status) return res.status(400).json(product)

         const { email } = req.session
         const price = Func.calculatePriceWithTax(parseInt(product.data.price), process.env.TAX)

         const options = {
            email: email,
            product_id: product.data._id,
            product_name: product.data.name
         }

         const json = await Payment.createPayment(price.total, 'qris', options)
         if (!json.status) return res.status(400).json(json)

         const invoice = await Database.invoiceAdd(email, {
            id: json.data.id,
            amount: price.total,
            items: [{
               id: product.data._id,
               name: product.data.name,
               price: product.data.price,
               fee: price.fee,
               quantity: 1
            }],
            additional_information,
            qr: json.data.qr,
            method: 'qris',
            receipt: json.data.receipt
         })

         if (!invoice.status) return res.status(400).json(invoice)

         res.json({
            creator: global.creator,
            status: true,
            data: {
               id: json.data.id,
               redirect: `/invoice/${json.data.id}`
            }
         })
      } catch (e) {
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message || 'Terjadi kesalahan pada server!'
         })
      }
   },
   error: false,
   login: true
}