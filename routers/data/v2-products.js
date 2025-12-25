import { Database } from '../../lib/index.js'

export const routes = {
   category: 'data',
   path: '/api/v2/products',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const { type } = req.session
         if (type !== 'admin') {
            return res.status(403).json({
               creator: global.creator,
               status: false,
               msg: 'Anda tidak memiliki izin untuk melakukan tindakan ini.'
            })
         }
         const { id } = req.query
         if (id) {
            const json = await Database.getProductWithFile(id)
            res.json(json)
         } else {
            const json = await Database.getAllProducts()
            res.json(json)
         }
      } catch (e) {
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message || 'Something went wrong!'
         })
      }
   },
   error: false,
   login: true
}