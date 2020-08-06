import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app'

describe('Test /users routes', () => {
  let mongooseConnection,
    mongoServer,
    request = supertest(app)

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri()

    mongooseConnection = (await mongoose.connect(mongoUri)).connection
  })

  beforeEach(async () => {
    await mongooseConnection.dropDatabase()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await mongoServer.stop()
  })

  describe('POST /users/auth', () => {
    it(`should throw error if the provider is not "github"`, async () => {
      expect.assertions(1)

      const res = await request.post('/users/auth').send({
        provider: 'not_github',
        code: 12345,
      })
      expect(res.statusCode).toEqual(500)
    })
  })

  describe('GET /users', () => {
    it('should return null if no token is provided', async () => {
      expect.assertions(1)
      const res = await request.get('/users/me').send()

      expect(res.body).toEqual(null)
    })
  })
})
