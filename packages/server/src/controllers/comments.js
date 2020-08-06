import Comment from '../models/Comment'

export const createComment = async ({ content, targetId, userId }) => {
  const comment = await Comment.create({ content, targetId, userId })
  return comment
}

export const paginateComments = async (
  query = {},
  { page = 1, limit = 10 },
) => {
  return Comment.paginate(query, {
    page,
    limit,
    populate: ['createdBy'],
    sort: '-_id',
  })
}
