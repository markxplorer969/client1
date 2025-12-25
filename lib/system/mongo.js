import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

class MongoDB {
   constructor(collection, options = {
      version: ServerApiVersion.v1,
      poolSize: 20,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
   }) {
      this.db = 'licence'
      this.options = options
   }

   client = new MongoClient(process.env.MONGODB_URI, this.options)

   exec = async (collect) => {
      let db = null
      try {
         await this.client.connect()
         db = await this.client.db(this.db).collection(collect)
      } catch (e) {
         console.error(e)
      }
      return db
   }

   create = async () => {
      try {
         await this.client.connect()
         const db = this.client.db(this.db)

         const collections = await db.listCollections().toArray()
         const collectionNames = collections.map(col => col.name)

         const requiredCollections = ['users', 'superuser', 'items']

         for (const name of requiredCollections) {
            if (!collectionNames.includes(name)) {
               await db.createCollection(name)
            }
         }

         const superuserCollection = db.collection('superuser')
         const existingSuperuser = await superuserCollection.findOne({ username: 'neoxr' })

         if (!existingSuperuser) {
            await superuserCollection.insertOne({
               username: 'neoxr',
               password: 'root',
               pin: 123321,
               created_at: new Date()
            })
         }
      } catch (e) {
         console.error(e)
      }
   }
}

export default new MongoDB