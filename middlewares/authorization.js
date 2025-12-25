import jwt from 'jsonwebtoken'
import requestIp from 'request-ip'

export default (req, res, next) => {
   const currentIp = requestIp.getClientIp(req)?.trim()
   const currentUserAgent = req.headers['user-agent']

   const authHeader = req.headers['authorization']
   const authToken = authHeader?.split(' ')[1]?.trim()

   if (!authToken || authToken !== req.session?.token) {
      return res.status(401).json({
         creator: global.creator,
         status: false,
         msg: 'Oops!, kamu harus login terlebih dahulu'
      })
   }

   try {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET)
      if (decoded.userAgent !== currentUserAgent) {
         return res.status(403).json({
            creator: global.creator,
            status: false,
            msg: 'Token tidak valid.'
         })
      }

      req.user = decoded
      next()
   } catch (err) {
      return res.status(403).json({
         creator: global.creator,
         status: false,
         msg: 'Sesi kadaluwarsa atau tidak valid.'
      })
   }
}