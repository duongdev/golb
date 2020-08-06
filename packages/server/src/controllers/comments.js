import Comment from '../models/Comment'

export const createComment = async ({ content, targetId, userId }) => {
  let comment = await Comment.create({ content, targetId, createdBy: userId })
  comment = await comment.populate('createdBy').execPopulate()
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
