import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v2',
   path: '/api/v2/statistic',
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
         const [productsResponse, usersResponse, invoicesResponse] = await Promise.all([
            Database.getAllProducts(),
            Database.getAllUsers(),
            Database.getAllInvoices({ limit: 8 })
         ])

         if (!productsResponse.status) throw new Error(productsResponse.msg || 'Gagal mengambil data produk.')
         if (!usersResponse.status) throw new Error(usersResponse.msg || 'Gagal mengambil data pengguna.')
         if (!invoicesResponse.status) throw new Error(invoicesResponse.msg || 'Gagal mengambil data invoice.')

         const allProducts = productsResponse.data || []
         const allUsers = usersResponse.data || []
         const recentInvoices = invoicesResponse.data.invoices || []

         const totalRevenue = (await Database.getAllInvoices({ query: { status: 'Paid' }, limit: 0 }))
            .data.invoices.reduce((acc, invoice) => acc + invoice.amount, 0)

         const totalSales = (await Database.getAllInvoices({ query: { status: 'Paid' }, limit: 0 }))
            .data.invoices.reduce((acc, invoice) => acc + invoice.items.length, 0)

         const totalProducts = allProducts.length

         const thirtyDaysAgo = new Date()
         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
         const newCustomers = allUsers.filter(user => user.joined_at && new Date(user.joined_at) > thirtyDaysAgo).length

         const topProducts = [...allProducts]
            .filter(product => (product.sales || 0) > 0)
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 8)
            .map(p => ({
               id: p._id,
               name: p.name,
               sales: p.sales || 0
            }))

         const recentSales = recentInvoices.map(invoice => ({
            id: invoice._id,
            productName: invoice.items.length > 1
               ? `${invoice.items[0].name} & lainnya`
               : invoice.items[0].name,
            date: invoice.created_at,
            status: invoice.status,
            amount: invoice.amount
         }))

         const dashboardData = {
            stats: {
               totalRevenue,
               totalSales,
               totalProducts,
               newCustomers
            },
            recentSales,
            topProducts
         }

         res.json({
            creator: global.creator,
            status: true,
            data: dashboardData
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