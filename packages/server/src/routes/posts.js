import { Router } from 'express'
import { requireUser } from '../middlewares/auth'
import {
  createPost,
  findPostBySlugOrId,
  paginatePosts,
  updatePost,
  deletePost,
} from '../controllers/posts'

const router = Router({ mergeParams: true })

router
  .route('/')
  .post(requireUser, async (req, res) => {
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
  .get(async (req, res) => {
    const { page, limit, searchText } = req.query
    const result = await paginatePosts({ searchText }, { page, limit })

    res.json({ ...result, searchText })
  })

router
  .route(`/:postSlugOrId`)
  .get(async (req, res) => {
    const { postSlugOrId } = req.params

    const post = await findPostBySlugOrId(postSlugOrId)

    if (post) {
      res.json(post)
      return
    }
    res.status(404).json(null)
  })
  .post(requireUser, async (req, res) => {
    const { user } = req
    const { title, content, plainText } = req.body
    const { postSlugOrId } = req.params

    let update = {}
    if (title) {
      update.title = title
    }
    if (content) {
      update.content = content
    }
    if (plainText) {
      update.plainText = plainText
    }

    const post = await updatePost(
      { userId: user._id, slugOrId: postSlugOrId },
      update,
    )

    res.json(post)
  })

router.delete(`/:postId`, requireUser, async (req, res) => {
  const { postId } = req.params
  const user = req.user
  const result = await deletePost({ postId, userId: user._id })
  res.json(result)
})

export default router
