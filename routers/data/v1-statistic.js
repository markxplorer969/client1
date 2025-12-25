import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v1',
   path: '/api/v1/statistic',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const { email } = req.session
         const [usersResponse, invoicesResponse] = await Promise.all([
            Database.getUser(email),
            Database.getAllInvoices({
               query: { email },
               // limit: 10,
               sort: { created_at: -1 }
            })
         ])

         if (!usersResponse.status) throw new Error(usersResponse.msg || 'Gagal mengambil data pengguna.')
         if (!invoicesResponse.status) throw new Error(invoicesResponse.msg || 'Gagal mengambil data invoice.')

         const totalPurchase = invoicesResponse.data.invoices?.filter(v => v.status === 'Paid').reduce((acc, invoice) => acc + invoice.amount, 0) || 0
         const totalTransactions = invoicesResponse.data.invoices.length || 0
         const totalItems = invoicesResponse.data.invoices?.filter(v => v.status === 'Paid')?.reduce((total, invoice) => {
            return total + (invoice.items?.length || 0)
         }, 0) || 0
         const transactions = invoicesResponse.data.invoices || []
         const items = invoicesResponse.data.invoices?.filter(v => v.status === 'Paid')?.map(invoice => invoice.items).flat() || []

         const dashboardData = {
            stats: {
               totalPurchase,
               totalTransactions,
               totalItems
            },
            email: usersResponse.data._id,
            name: usersResponse.data.name,
            joinedAt: usersResponse.data.joined_at,
            transactions,
            items
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