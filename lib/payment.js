import Tripay from './gateway/tripay.js'
import Xendit from './gateway/xendit.js'
import Midtrans from './gateway/midtrans.js'

const options = {
   prefix: 'NXR',
   expiration: 10
}

const tripay = new Tripay({
   ...options
})

const xendit = new Xendit({
   success_callback_url: 'https://www.yilzidev.tech/dashboard',
   failure_callback_url: 'https://www.yilzidev.tech/dashboard',
   ...options
})

const midtrans = new Midtrans({
   ...options
})

class Payment {
   constructor() {
      this.model = process.env.PAYMENT_GATEWAY
   }

   createPayment = async (amount, method = 'qris', options = {}) => {
      try {
         const json = await (
            this.model === 'xendit'
               ? xendit.createPayment(amount, method, options)
               : this.model === 'midtrans'
                  ? midtrans.createPayment(amount, method, options)
                  : tripay.createPayment(amount, method, options)
         )

         if (!json.status) throw new Error(json.msg)

         const id = this.model === 'xendit'
            ? json.data.metadata.sku
            : this.model === 'midtrans'
               ? json.data.order_id
               : json.data.merchant_ref

         const receipt = this.model === 'xendit'
            ? json.data.id
            : this.model === 'midtrans'
               ? json.data.transaction_id
               : json.data.reference

         return ({
            creator: global.creator,
            status: true,
            data: { id, receipt, qr: json.data.qr_image }
         })
      } catch (e) {
         return ({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   }

   checkPayment = async receipt => {
      try {
         const json = await (
            this.model === 'xendit'
               ? xendit.checkPayment(receipt)
               : this.model === 'midtrans'
                  ? midtrans.checkPayment(receipt)
                  : tripay.checkPayment(receipt)
         )

         if (!json.status) throw new Error(json.msg)

         const result = this.model === 'xendit'
            ? json.data.status === 'SUCCEEDED'
            : this.model === 'midtrans'
               ? json.data.transaction_status === 'settlement'
               : json.data.status === 'PAID'

         if (!result) throw new Error('Transaksi belum terselesaikan.')

         return json
      } catch (e) {
         return ({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   }
}

export default new Payment