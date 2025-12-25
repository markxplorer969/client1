import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { imgkub, quax } from '@neoxr/helper'
import Jimp from 'jimp'
import { Func } from '../../lib/index.js'

const productUploads = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: 20 * 1024 * 1024 }
}).fields([
   { name: 'image', maxCount: 1 },
   { name: 'file', maxCount: 1 }
])

const processFiles = async (req, res, next) => {
   try {
      if (req.files?.image) {
         const imageFile = req.files.image[0]
         const image = await Jimp.read(imageFile.buffer)
         image.cover(1080, 1080)
         const croppedBuffer = await image.getBufferAsync(imageFile.mimetype)
         const result = await imgkub(croppedBuffer)
         if (result?.data?.url) req.body.imageUrl = result.data.url
      }

      if (req.files?.file) {
         const productFile = req.files.file[0]
         const destination = req.body.file_upload_destination
         const extension = path.extname(productFile.originalname).slice(1)

         const fileObject = {
            bytes: productFile.size,
            size: Func.formatBytes(productFile.size),
            mime: productFile.mimetype,
            extension: extension,
            type: 'local',
            data: ''
         }

         if (destination === 'cloud') {
            const result = await quax(productFile.buffer)
            if (!result?.data?.url) throw new Error('Gagal mengunggah file ke Quax.')
            fileObject.type = 'cloud'
            fileObject.data = result.data.url
         } else {
            const targetDir = path.join(process.cwd(), 'public', 'files')
            fs.mkdirSync(targetDir, { recursive: true })
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const newFilename = `${uniqueSuffix}-${productFile.originalname.replace(/\s/g, '_')}`
            const filePath = path.join(targetDir, newFilename)
            fs.writeFileSync(filePath, productFile.buffer)
            fileObject.type = 'local'
            fileObject.data = `/files/${newFilename}`
         }

         req.body.file = fileObject
      } else if (req.body.file_url) {
         req.body.file = {
            type: 'cloud',
            data: req.body.file_url,
            size: null, bytes: null, mime: null, extension: null
         }
      } else if (req.body.file === '') {
         req.body.file = null
      }

      next()
   } catch (error) {
      next(error)
   }
}

export { productUploads, processFiles }