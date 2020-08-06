import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import axios from 'axios'
import * as usersControllers from '../users'
import User from '../../models/User'

jest.mock('axios')

describe(`Test users controllers`, () => {
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

  describe('authenticateWithGitHub', () => {
    it(`should create a new user and sign a token`, async () => {
      expect.assertions(1)

      axios.post.mockResolvedValue({ data: { access_token: 'TOKEN' } })
      axios.get.mockResolvedValue({
        data: {
          email: 'dustin.do95@gmail.com',
          login: 'duongdev',
          name: 'Duong Do',
          avatar_url: 'http://example.com/an_avatar.jpg',
        },
      })
      const result = await usersControllers.authenticateWithGitHub({
        code: 12345,
      })

      expect(result).toMatchObject({
        token: expect.any(String),
        user: {
          email: 'dustin.do95@gmail.com',
          username: 'duongdev',
          avatar: 'http://example.com/an_avatar.jpg',
          name: 'Duong Do',
          id: expect.any(String),
          createdAt: expect.any(Date),
        },
      })
    })

    it(`should return the existing user that matches the email`, async () => {
      expect.assertions(1)

      axios.post.mockResolvedValue({ data: { access_token: 'TOKEN' } })
      axios.get.mockResolvedValue({
        data: {
          email: 'dustin.do95@gmail.com',
          login: 'duongdev',
          name: 'Duong Do',
          avatar_url: 'http://example.com/an_avatar.jpg',
        },
      })

      const existingUser = await User.create({
        email: 'dustin.do95@gmail.com',
        username: 'duongdev',
        avatar: 'http://example.com/an_avatar.jpg',
        name: 'Duong Do',
      })

      const { user } = await usersControllers.authenticateWithGitHub({
        code: 12345,
      })

      expect(user.id).toEqual(existingUser._id.toString())
    })
  })

  describe('findUserById', () => {
    it(`should return null if the ID doesn't exist`, async () => {
      expect(
        usersControllers.findUserById(mongoose.Types.ObjectId()),
      ).resolves.toBe(null)
    })
    it(`should return the correct user the an existing ID`, async () => {
      expect.assertions(1)
      const user = await User.create({
        email: 'dustin.do95@gmail.com',
        username: 'duongdev',
        avatar: 'http://example.com/an_avatar.jpg',
        name: 'Duong Do',
      })
      expect(
        usersControllers.findUserById(user._id.toString()),
      ).resolves.toMatchObject({
        email: 'dustin.do95@gmail.com',
        username: 'duongdev',
        avatar: 'http://example.com/an_avatar.jpg',
        name: 'Duong Do',
      })
    })
  })
})
