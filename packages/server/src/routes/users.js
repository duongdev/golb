import { Router } from 'express'

const router = Router({ mergeParams: true })

router.post(`/`, async (req, res) => {
  res.json('ok')
})

export default router
