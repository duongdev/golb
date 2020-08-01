import { verify } from 'jsonwebtoken'
import { findUserById } from '../controllers/users'

export const parseToken = async (req, res, next) => {
  const token = req.headers.authorization

  try {
    const data = verify(token, process.env.JWT_SECRET)
    const user = await findUserById(data.id)
    req.user = user.toJSON()
  } catch (error) {}

  next()
}

export const requireUser = (req, res, next) => {
  if (req.user) {
    return next()
  }

  res.status(403).json({ message: 'Unauthorized' })
}
