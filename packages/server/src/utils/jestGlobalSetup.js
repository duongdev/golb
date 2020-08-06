import { MongoMemoryServer } from 'mongodb-memory-server'
import Debug from 'debug'

// This util downloads the binary of MongoMemoryServer before the tests runs...
module.exports = async () => {
  const debug = Debug('globalSetup')
  const mongoServer = new MongoMemoryServer()
  await mongoServer.getConnectionString()

  await mongoServer.stop()
  debug('Initialized MongoDB Memory Server successfully.')
}
