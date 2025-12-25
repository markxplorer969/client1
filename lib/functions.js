import Jwt from 'jsonwebtoken'

class Functions {
   makeId = length => {
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
   }

   toTime = (ms) => {
      let h = Math.floor(ms / 3600000)
      let m = Math.floor(ms / 60000) % 60
      let s = Math.floor(ms / 1000) % 60
      return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
   }

   toMs = time => {
      const timeValue = parseInt(time.slice(0, -1))
      const timeUnit = time.slice(-1).toLowerCase()

      switch (timeUnit) {
         case 'h':
            return timeValue * 3600000; // 1 jam = 3600000 ms
         case 'm':
            return timeValue * 60000; // 1 menit = 60000 ms
         case 's':
            return timeValue * 1000; // 1 detik = 1000 ms
         default:
            throw new Error("Unit not recognized! Use 'h', 'm', or 's'.")
      }
   }

   calculatePriceWithTax = (basePrice, taxPercent = 10) => {
      const tax = basePrice * (taxPercent / 100)
      const total = basePrice + tax

      return {
         basePrice: parseInt(basePrice?.toFixed(0)),
         tax: parseInt(tax?.toFixed(0)),
         total: parseInt(total?.toFixed(0))
      }
   }

   genTokenFromUrl = (url, filename, cookie) => {
      try {
         const expiresIn = 60 * 60
         const token = Jwt.sign({
            url: url,
            filename: encodeURIComponent(filename),
            cookie: cookie
         }, process.env.JWT_SECRET, { expiresIn })
         return token
      } catch (error) {
         return false
      }
   }

   formatBytes = (bytes, decimals = 2) => {
      if (!+bytes) return '0 Bytes'
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
   }
}

export default new Functions