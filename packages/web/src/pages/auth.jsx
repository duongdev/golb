import React from 'react'
import Layout from 'components/Layout'
import { createClient } from 'api-client'
import { setCookie } from 'nookies'
import { Container, Typography } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { TOKEN_COOKIE } from 'constants/common'
import RequireSignIn from 'components/RequireSignIn'

const Auth = ({ success, redirect, user, showSignInOptions }) => {
  const router = useRouter()

  useEffect(() => {
    if (success && redirect) {
      router.replace(redirect)
    }
  }, [redirect, router, success])

  if (showSignInOptions) {
    return (
      <Layout>
        <RequireSignIn redirect={redirect} />
      </Layout>
    )
  }

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography align="center" variant="h6">
          {success
            ? `Welcome back @${user?.username}. Redirecting...`
            : 'Sign in failed. Please try again later.'}
        </Typography>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { provider, redirect = null, code } = context.query

  if (!(provider && code)) {
    return {
      props: {
        showSignInOptions: true,
        redirect: redirect,
      },
    }
  }

  const apiClient = createClient()

  const { data } = await apiClient.post('/users/auth', {
    provider,
    code,
  })

  if (data && data.user && data.token) {
    setCookie(context, TOKEN_COOKIE, data.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    return {
      props: {
        success: true,
        redirect,
        user: data.user,
      },
    }
  }

  return {
    props: {
      success: false,
    },
  }
}

export default Auth
