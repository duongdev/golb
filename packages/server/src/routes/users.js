import { Router } from 'express'
import { authenticateWithGitHub } from '../controllers/users'
import { parseToken } from '../middlewares/auth'

const router = Router({ mergeParams: true })

router.post(`/auth`, async (req, res) => {
  const { code, provider } = req.body

  try {
    if (provider === 'github') {
      const auth = await authenticateWithGitHub({ code })
      res.json(auth)
      return
    } else {
      throw new Error('provider_is_not_supported')
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal error' })
  }
})

router.get(`/me`, parseToken, async (req, res) => {
  res.json(req.user || null)
})

export default router
