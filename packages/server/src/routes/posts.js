import { requireUser } from '../middlewares/auth'
import { createPost, findPostBySlug } from '../controllers/posts'

const { Router } = require('express')

const router = Router({ mergeParams: true })

router.post(`/`, requireUser, async (req, res) => {
  const { title, content, plainText } = req.body
  const user = req.user

  const post = await createPost({ title, content, plainText, userId: user._id })

  return res.json(post)
})

router.get(`/:postSlug`, async (req, res) => {
  const { postSlug } = req.params

  const post = await findPostBySlug(postSlug)

  if (post) {
    res.json(post)
    return
  }
  res.status(404).json(null)
})

export default router
