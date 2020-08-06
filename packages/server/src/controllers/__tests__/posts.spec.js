import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import User from '../../models/User'
import Post from '../../models/Post'
import * as postsControllers from '../posts'

const postData = {
  title: 'This is the post title',
  content: [{ foo: 'bar' }],
  plainText: 'bar content lorem ipsum',
}

describe('Test posts controllers', () => {
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

  describe('createPost', () => {
    it(`should create a post successfully with populated createdBy`, async () => {
      expect.assertions(1)
      const user = await User.create({
        email: 'dustin.do95@gmail.com',
        username: 'duongdev',
        avatar: 'http://example.com/an_avatar.jpg',
        name: 'Duong Do',
      })
      const post = await postsControllers.createPost({
        ...postData,
        userId: user._id.toString(),
      })

      expect(post).toMatchObject({
        id: expect.any(String),
        title: 'This is the post title',
        content: [{ foo: 'bar' }],
        plainText: 'bar content lorem ipsum',
        createdAt: expect.any(Date),
        createdBy: {
          id: expect.any(String),
          email: 'dustin.do95@gmail.com',
          username: 'duongdev',
          avatar: 'http://example.com/an_avatar.jpg',
          name: 'Duong Do',
        },
      })
    })
  })

  describe('findPostBySlugOrId', () => {
    it(`should return null if the slugOrId doesn't exist`, async () => {
      expect.assertions(1)
      const post = await postsControllers.findPostBySlugOrId(`never_exists`)
      expect(post).toBe(null)
    })
    it(`should return the post with populated fields`, async () => {
      expect.assertions(2)
      const user = await User.create({
        email: 'dustin.do95@gmail.com',
        username: 'duongdev',
        avatar: 'http://example.com/an_avatar.jpg',
        name: 'Duong Do',
      })
      const existingPost = await postsControllers.createPost({
        ...postData,
        userId: user._id.toString(),
      })
      const post1 = await postsControllers.findPostBySlugOrId(existingPost.slug)
      expect(post1).toMatchObject({
        ...postData,
        createdBy: {
          email: 'dustin.do95@gmail.com',
          username: 'duongdev',
          avatar: 'http://example.com/an_avatar.jpg',
          name: 'Duong Do',
        },
      })
      const post2 = await postsControllers.findPostBySlugOrId(existingPost.id)
      expect(post2).toMatchObject({
        ...postData,
        createdBy: {
          email: 'dustin.do95@gmail.com',
          username: 'duongdev',
          avatar: 'http://example.com/an_avatar.jpg',
          name: 'Duong Do',
        },
      })
    })
  })

  describe('updatePost', () => {
    it(`should return null if the post doesn't exist`, async () => {
      expect.assertions(1)
      expect(await postsControllers.updatePost('not_exist')).toBe(null)
    })

    it(`should return the updated post, with populated fields`, async () => {
      const user = await User.create({
        email: 'dustin.do95@gmail.com',
        username: 'duongdev',
        avatar: 'http://example.com/an_avatar.jpg',
        name: 'Duong Do',
      })
      const existingPost = await postsControllers.createPost({
        ...postData,
        userId: user._id.toString(),
      })
      const post = await postsControllers.updatePost(
        {
          slugOrId: existingPost.slug,
          userId: user.id,
        },
        {
          title: 'The new title',
          content: [{ foo: 'new bar' }],
          plainText: 'whats next?',
        },
      )
      expect(post).toMatchObject({
        title: 'The new title',
        content: [{ foo: 'new bar' }],
        plainText: 'whats next?',
        createdBy: {
          email: 'dustin.do95@gmail.com',
          username: 'duongdev',
          avatar: 'http://example.com/an_avatar.jpg',
          name: 'Duong Do',
        },
      })
    })
  })

  describe('deletePost', () => {
    it(`should delete the post successfully`, async () => {
      expect.assertions(1)
      const user = await User.create({
        email: 'dustin.do95@gmail.com',
        username: 'duongdev',
        avatar: 'http://example.com/an_avatar.jpg',
        name: 'Duong Do',
      })
      const existingPost = await postsControllers.createPost({
        ...postData,
        userId: user._id.toString(),
      })
      await postsControllers.deletePost({
        postId: existingPost.id,
        userId: user.id,
      })
      expect(await Post.findById(existingPost.id)).toBe(null)
    })
  })

  describe('paginatePosts', () => {
    // TODO: Too tired, many things else to do. Will write later :)
    // This test basically depends on the mongoose-paginate-v2, so writing test
    // for it is boring.
  })
})
