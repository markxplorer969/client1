import 'dotenv/config'
import './lib/system/config.js'
import { Func, Database } from './lib/index.js'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import requestIp from 'request-ip'
import morgan from 'morgan'
import os from 'node:os'
import CFonts from 'cfonts'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'cookie-session'
import createRouter from './lib/system/defineRoute.js'

import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

const PORT = process.env.PORT || 3000

const runServer = async () => {
   const app = express()

   const httpServer = createServer(app)
   const io = new SocketIOServer(httpServer, {
      cors: {
         origin: '*'
      }
   })

   io.on('connection', (socket) => {
      console.log(`🔌 Socket connected: ${socket.id}`)

      const system = async () => {
         const cpuUsage = os.loadavg()[0]
         const totalMemory = os.totalmem()
         const freeMemory = os.freemem()
         const usedMemory = totalMemory - freeMemory
         const diskUsage = 0

         const information = {
            device: `${os.type()} (${os.arch()})`,
            cpuUsage: cpuUsage.toFixed(2),
            memory: {
               total: totalMemory,
               used: usedMemory,
               free: freeMemory,
               usage: ((usedMemory / totalMemory) * 100).toFixed(2)
            },
            runtime: Func.toTime(process.uptime() * 1000),
            processor: `${os.cpus()[0].model}`,
            diskUsage: diskUsage.toFixed(2)
         }
         socket.emit('system', information)
      }

      const interval = setInterval(system, 1000)

      socket.on('disconnect', () => {
         clearInterval(interval)
         console.log('Client disconnected')
      })
   })

   app.set('json spaces', 3)
      .use((req, res, next) => {
         if (!req.timedout) next()
      })
      .use(express.json())
      .use(requestIp.mw())
      .use(morgan((tokens, req, res) => {
         const userAgent = req.headers['user-agent'] || 'unknown';
         if (req.method !== 'OPTIONS' && !/(WhatsApp)/gis.test(userAgent)) {
            return [
               req.clientIp,
               tokens.method(req, res),
               tokens.url(req, res),
               tokens.status(req, res),
               '-',
               tokens['response-time'](req, res), 'ms'
               // `User-Agent: ${userAgent}`
            ].join(' ')
         }
      }))
      .use(bodyParser.json({ limit: '50mb' }))
      .use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
      .use(session({
         name: 'token',
         keys: ['session'],
         maxAge: 72 * 60 * 60 * 1000, // 3 days
         httpOnly: false,
         sameSite: 'strict'
      }))
      .use(cookieParser())
      .use(express.static(path.join(process.cwd(), 'public')))
      .use(express.static(path.join(process.cwd(), 'nuxt/dist')))
      .use((req, res, next) => {
         req.io = io
         next()
      })
      .use(cors())

   // Dynamically import the request handler module
   await (new createRouter(app)).load(path.join(process.cwd(), 'routers'))

   app.use('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'nuxt/dist', '404.html'))
   })

   app.disable('x-powered-by')
   app.use((req, res, next) => {
      res.setHeader('X-Powered-By', 'Neoxr Creative Server')
      next()
   })

   const startInvoiceCleanupScheduler = () => {
      const cleanupInterval = 60 * 1000 * 5
      setInterval(async () => {
         await Database.cleanupPendingInvoices()
      }, cleanupInterval)
   }

   startInvoiceCleanupScheduler()

   httpServer.listen(PORT, () => {
      console.clear()
      CFonts.say('Open-API', {
         font: 'tiny',
         align: 'center',
         colors: ['system']
      })
      CFonts.say('Github : https://github.com/neoxr/open-api', {
         colors: ['system'],
         font: 'console',
         align: 'center'
      })
      console.log(chalk.yellowBright.bold('Server listening on PORT --->', `http://localhost:${PORT}`))
   })
}

runServer().catch(() => runServer())