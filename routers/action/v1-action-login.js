import { OAuth2Client } from 'google-auth-library'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
import jwt from 'jsonwebtoken'
import requestIp from 'request-ip'
import { Database, Func } from '../../lib/index.js'

export const routes = {
   category: 'v1',
   path: '/api/v1/login',
   parameter: ['token'],
   method: 'post',
   execution: async (req, res, next) => {
      try {
         const { token } = req.body
         const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
         })
         const { email, name } = ticket.getPayload()
         if (!email) return res.status(400).json({
            creator: global.creator,
            status: false,
            msg: 'Invalid OAuth token'
         })

         const ip = requestIp.getClientIp(req)?.trim()
         const userAgent = req.headers['user-agent']

         const JWT_EXPIRY = '72h'
         const json = await Database.getUser(email)
         if (!json.status) {
            const result = await Database.userAdd(email, name)
            if (!result.status) return res.status(400).json(result)
            const auth_token = jwt.sign({ email, userAgent }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY })
            req.session.login = true
            req.session.email = email
            req.session.token = auth_token
            req.session.type = (email == process.env.ADMIN_EMAIL) ? 'admin' : 'user'
            res.json({
               creator: global.creator,
               status: true,
               data: {
                  token: auth_token,
                  type: (email == process.env.ADMIN_EMAIL) ? 'admin' : 'user',
                  created_at: Date.now(),
                  expired_at: Func.toMs(JWT_EXPIRY)
               }
            })
         } else {
            if (json.data.role === 'banned') return res.status(403).json({
               creator: global.creator,
               status: false,
               msg: 'Akun anda ditangguhkan'
            })
            if (json.data.name !== name) {
               Database.userEdit(email, { name })
            }
            const auth_token = jwt.sign({ email, userAgent }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY })
            req.session.login = true
            req.session.email = email
            req.session.token = auth_token
            req.session.type = (email == process.env.ADMIN_EMAIL) ? 'admin' : 'user'
            res.json({
               creator: global.creator,
               status: true,
               data: {
                  token: auth_token,
                  type: (email == process.env.ADMIN_EMAIL) ? 'admin' : 'user',
                  created_at: Date.now(),
                  expired_at: Func.toMs(JWT_EXPIRY)
               }
            })
         }
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