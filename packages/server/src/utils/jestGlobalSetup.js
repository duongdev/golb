import { MongoMemoryServer } from 'mongodb-memory-server'
import Debug from 'debug'
import * as dotenv from 'dotenv'

const NODE_ENV = process.env.NODE_ENV || 'development'

const fileList = [
  `.env.${NODE_ENV}.local`,
  `.env.${NODE_ENV}`,
  '.env.local',
  '.env',
]

// This util downloads the binary of MongoMemoryServer before the tests runs...
module.exports = async () => {
  const debug = Debug('globalSetup')

  fileList.forEach((file) => {
    dotenv.config({ path: file })
  })

  const mongoServer = new MongoMemoryServer()
  await mongoServer.getConnectionString()

  await mongoServer.stop()
  debug('Initialized MongoDB Memory Server successfully.')
}
