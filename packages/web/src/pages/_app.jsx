import React from 'react'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../theme'
import { getAuthUser } from 'api-client'
import { AuthProvider } from 'contexts/AuthContext'
import NProgress from 'nprogress'
import Router, { useRouter } from 'next/router'
import useScrollRestoration from 'hooks/useScrollRestoration'

import './_app.css'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

Router.onRouteChangeStart = () => {
  NProgress.start()
}

Router.onRouteChangeComplete = () => {
  NProgress.done()
}

Router.onRouteChangeError = () => {
  NProgress.done()
}

export default function MyApp(props) {
  const { Component, pageProps } = props
  const router = useRouter()

  useScrollRestoration(router)

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <AuthProvider user={props.user}>
      <React.Fragment>
        <Head>
          <title>Golb Community</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component user={props.user} {...pageProps} />
        </ThemeProvider>
      </React.Fragment>
    </AuthProvider>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  const user = await getAuthUser(ctx)

  return { user }
}
