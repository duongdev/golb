import Post from '../models/Post'
import { isValidObjectId } from '../utils/common'

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
  console.log(slugOrId, isValidObjectId(slugOrId))
  let query = {}
  if (isValidObjectId(slugOrId)) {
    query = { $or: [{ _id: slugOrId }, { slug: slugOrId }] }
  } else {
    query = { slug: slugOrId }
  }
  const post = await Post.findOne(query).populate('createdBy')

  return post
}

export const paginatePosts = async ($query = {}, { page = 1, limit = 10 }) => {
  let query = {}
  if ($query.searchText) {
    query = {
      ...query,
      $text: { $search: $query.searchText },
    }
  }

  return Post.paginate(query, {
    page,
    limit,
    populate: ['createdBy'],
    sort: '-_id',
  })
}

export const updatePost = async ({ slugOrId, userId }, update) => {
  let query = { createdBy: userId }
  if (isValidObjectId(slugOrId)) {
    query = { ...query, $or: [{ _id: slugOrId }, { slug: slugOrId }] }
  } else {
    query = { ...query, slug: slugOrId }
  }
  const post = await Post.findOneAndUpdate(query, update, {
    new: true,
  }).populate('createdBy')

  if (post) {
    post.slug = await Post.getUniqueSlug(post._id, post.title)
    await post.save()
  }

  return post
}

export const deletePost = async ({ postId, userId }) => {
  return Post.findOneAndRemove({ _id: postId, createdBy: userId })
}
