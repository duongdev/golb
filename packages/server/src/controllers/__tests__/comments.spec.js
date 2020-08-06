import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import User from '../../models/User'
import * as commentsControllers from '../comments'

describe('Test comments controllers', () => {
  let mongooseConnection, mongoServer

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

  describe('createComment', () => {
    it(`should create comment successfully with populated fields`, async () => {
      const user = await User.create({
        email: 'dustin.do95@gmail.com',
        username: 'duongdev',
        avatar: 'http://example.com/an_avatar.jpg',
        name: 'Duong Do',
      })
      const targetId = mongoose.Types.ObjectId()
      const comment = await commentsControllers.createComment({
        content: 'The comment content',
        targetId: targetId.toHexString(),
        userId: user.id,
      })

      expect(comment.toJSON()).toMatchObject({
        content: 'The comment content',
        targetId,
        id: expect.any(String),
        createdBy: {
          email: 'dustin.do95@gmail.com',
          username: 'duongdev',
          avatar: 'http://example.com/an_avatar.jpg',
          name: 'Duong Do',
        },
      })
    })
  })
  describe('paginateComments', () => {
    // Haiz...
  })
})
