import Post from '../models/Post'
import { isValidObjectId } from 'mongoose'

export const createPost = async ({ title, content, plainText, userId }) => {
  const post = await Post.create({
    title,
    content,
    plainText,
    createdBy: userId,
  })

  return post
}

export const findPostBySlugOrId = async (slugOrId) => {
  let query = {}
  if (isValidObjectId(slugOrId)) {
    query = { $or: [{ _id: slugOrId }, { slug: slugOrId }] }
  } else {
    query = { slug: slugOrId }
  }
  const post = await Post.findOne(query).populate('createdBy')

  return post
}

export const paginatePosts = async (query = {}, { page = 1, limit = 10 }) => {
  return Post.paginate(query, {
    page,
    limit,
    populate: ['createdBy'],
    sort: '-_id',
  })
}
