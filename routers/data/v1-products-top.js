import { Database } from '../../lib/index.js'

export const routes = {
   category: 'data',
   path: '/api/v1/top-products',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const json = await Database.getAllProducts({
            query: {
               sales: { $gt: 1 }
            },
            sort: {
               sales: -1
            },
            limit: 4
         })
         res.json(json)
      } catch (e) {
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message || 'Terjadi kesalahan pada server!'
         })
      }
   },
   error: false
}