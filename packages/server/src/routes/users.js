import { Router } from 'express'
import { authenticateWithGitHub } from '../controllers/users'
import { parseToken } from '../middlewares/auth'

const router = Router({ mergeParams: true })

/**
 * @swagger
 *
 * /users:
 *   post:
 *     description: Create a new user with email and password
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.post(`/auth`, async (req, res) => {
  const { code, provider } = req.body

  try {
    if (provider === 'github') {
      const auth = await authenticateWithGitHub({ code })
      res.json(auth)
      return
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal error' })
  }
})

router.get(`/me`, parseToken, async (req, res) => {
  res.json(req.user)
})

export default router
