import { Database } from '../../lib/index.js'

export const routes = {
   category: 'data',
   path: '/api/v1/products',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const { id } = req.query
         if (id) {
            const json = await Database.getProduct(id)
            res.json(json)
         } else {
            const json = await Database.getAllProducts({ query: { show: true }, sort: { updated_at: -1 } })
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
   error: false
}