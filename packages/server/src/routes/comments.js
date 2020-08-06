import { Router } from 'express'
import { createComment, paginateComments } from '../controllers/comments'
import { requireUser } from '../middlewares/auth'

const router = Router({ mergeParams: true })

router
  .route('/:targetId')
  .post(requireUser, async (req, res) => {
    const {
      user,
      params: { targetId },
      body: { content },
    } = req

    const comment = await createComment({
      content,
      targetId,
      userId: user._id,
    })

    res.json(comment)
  })
  .get(async (req, res) => {
    const {
      params: { targetId },
      query: { page, limit },
    } = req

    const result = await paginateComments({ targetId }, { page, limit })

    res.json(result)
  })

export default router
