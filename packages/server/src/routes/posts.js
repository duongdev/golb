import { Router } from 'express'
import { requireUser } from '../middlewares/auth'
import {
  createPost,
  findPostBySlugOrId,
  paginatePosts,
  updatePost,
  deletePost,
} from '../controllers/posts'
import * as commentsControllers from '../controllers/comments'

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
    const { page, limit } = req.query
    const result = await paginatePosts({}, { page, limit })

    res.json(result)
  })

router
  .route(`/:postSlugOrId`)
  .get(async (req, res) => {
    console.log('here')
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

router
  .route(`/:postId/comments`)
  .post(requireUser, async (req, res) => {
    const {
      user,
      params: { postId },
      body: { content },
    } = req

    const comment = await commentsControllers.createComment({
      content,
      targetId: postId,
      userId: user._id,
    })

    res.json(comment)
  })
  .get(async (req, res) => {
    const {
      params: { postId },
      query: { page, limit },
    } = req

    const result = await commentsControllers.paginateComments(
      { targetId: postId },
      { page, limit },
    )

    res.json(result)
  })

router.delete(`/:postId`, requireUser, async (req, res) => {
  const { postId } = req.params
  const user = req.user
  const result = await deletePost({ postId, userId: user._id })
  res.json(result)
})

export default router
