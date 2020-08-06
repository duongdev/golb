import axios from 'axios'
import User from '../models/User'
import jwt from 'jsonwebtoken'

export const authenticateWithGitHub = async ({ code }) => {
  const { data: githubTokenData } = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.GH_CLIENT_ID,
      client_secret: process.env.GH_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )

  const ghToken = githubTokenData.access_token

  const { data: ghUser } = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${ghToken}`,
    },
  })

  const user = await User.findOneAndUpdate(
    { email: ghUser.email },
    {
      email: ghUser.email,
      username: ghUser.login,
      name: ghUser.name,
      avatar: ghUser.avatar_url,
    },
    { upsert: true, new: true },
  )

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

  return { user: user.toJSON(), token }
}

export const findUserById = async (userId) => {
  try {
    return await User.findById(userId)
  } catch (error) {
    return null
  }
}
