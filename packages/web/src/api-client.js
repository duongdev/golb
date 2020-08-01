import axios from 'axios'
import { parseCookies } from 'nookies'
import { TOKEN_COOKIE } from 'constants/common'

export const createClient = (ctx) => {
  const cookies = parseCookies(ctx)
  const token = cookies[TOKEN_COOKIE]
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
    headers: token
      ? {
          Authorization: token,
        }
      : {},
  })
}

export const getAuthUser = async (ctx) => {
  try {
    const client = createClient(ctx)
    const { data: user } = await client.get('/users/me')

    return user
  } catch (error) {
    return null
  }
}
