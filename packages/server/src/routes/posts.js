import { requireUser } from '../middlewares/auth'
import {
  createPost,
  findPostBySlugOrId,
  paginatePosts,
} from '../controllers/posts'

const { Router } = require('express')

const router = Router({ mergeParams: true })

router
  .post(`/`, requireUser, async (req, res) => {
    const { title, content, plainText } = req.body
    const user = req.user

    const post = await createPost({
      title,
      content,
      plainText,
      userId: user._id,
    })

    return res.json(post)
  })
  .get(`/`, async (req, res) => {
    const { page, limit } = req.query
    const result = await paginatePosts({}, { page, limit })

    res.json(result)
  })

router.get(`/:postSlugOrId`, async (req, res) => {
  const { postSlugOrId } = req.params

  const post = await findPostBySlugOrId(postSlugOrId)

  if (post) {
    res.json(post)
    return
  }
  res.status(404).json(null)
})

export default router
