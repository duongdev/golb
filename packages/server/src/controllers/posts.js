import Post from '../models/Post'

export const createPost = async ({ title, content, plainText, userId }) => {
  const post = await Post.create({
    title,
    content,
    plainText,
    createdBy: userId,
  })

  return post
}

export const findPostBySlug = async (slug) => {
  const post = await Post.findOne({ slug }).populate('createdBy')

  return post
}
