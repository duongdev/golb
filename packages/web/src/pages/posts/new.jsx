import React, { useRef, useCallback } from 'react'
import Layout from 'components/Layout'
import { useAuth } from 'contexts/AuthContext'
import {
  Container,
  Grid,
  TextField,
  Box,
  AppBar as MuiAppBar,
  makeStyles,
  Button,
  Typography,
} from '@material-ui/core'
import dynamic from 'next/dynamic'
import { APP_BAR_HEIGHT } from 'constants/ui'
import Logo from 'components/Logo'
import { Formik } from 'formik'
import * as yup from 'yup'
import { createClient } from 'api-client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Editor = dynamic(() => import('components/Editor'), {
  ssr: false,
})

const NewPost = () => {
  const classes = useStyles()
  const user = useAuth()
  const router = useRouter()
  const editorRef = useRef(null)

  useEffect(() => {
    if (!user) {
      router.replace(`/auth?redirect=${encodeURIComponent(router.pathname)}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = useCallback(
    async (values, formik) => {
      const client = createClient()

      const plainText = editorRef.current?.innerText
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ')

      const { data: post } = await client.post(`/posts`, {
        title: values.title,
        content: values.content,
        plainText,
      })

      if (post && post.slug) {
        router.push(`/posts/[postSlugOrId]`, `/posts/${post.slug}`)
      }
    },
    [router],
  )

  if (!user) {
    return (
      <Layout>
        <Typography align="center" variant="h6">
          Redirecting to sign in...
        </Typography>
      </Layout>
    )
  }

  return (
    <Layout title="Write a new post" disableAppBar={user}>
      <Formik
        onSubmit={handleSubmit}
        initialValues={{
          title: '',
          content: null,
        }}
        validationSchema={yup.object().shape({
          title: yup.string().required().min(5),
          content: yup.mixed().required(),
        })}
      >
        {(formik) => (
          <>
            <AppBar
              onSubmit={() => formik.submitForm()}
              disabled={!formik.isValid || formik.isSubmitting}
            />
            <Container maxWidth="md">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding={4}
              >
                <Grid container spacing={2} justify="center">
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      placeholder="New post title here..."
                      variant="standard"
                      autoFocus
                      InputProps={{
                        className: classes.postTitle,
                        disableUnderline: true,
                      }}
                      value={formik.values.title}
                      onChange={(e) =>
                        formik.setFieldValue('title', e.target.value)
                      }
                      disabled={formik.isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div ref={editorRef}>
                      <Editor
                        value={formik.values.content}
                        onChange={(content) =>
                          formik.setFieldValue('content', content)
                        }
                        disabled={formik.isSubmitting}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </>
        )}
      </Formik>
    </Layout>
  )
}

const AppBar = (props) => {
  const classes = useStyles(props)
  return (
    <MuiAppBar color="transparent" position="fixed" className={classes.appBar}>
      <Container maxWidth={false}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Logo />
          </Grid>
          <Grid item xs />
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={props.onSubmit}
              disabled={props.disabled}
            >
              Publish your post
            </Button>
          </Grid>
        </Grid>
      </Container>
    </MuiAppBar>
  )
}

const useStyles = makeStyles(({ typography, palette, shadows }) => ({
  '@global': {
    body: {
      backgroundColor: palette.background.paper,
    },
  },
  appBar: {
    background: 'hsla(0,0%,100%,.6)',
    backdropFilter: 'blur(3px)',
    height: APP_BAR_HEIGHT,
    display: 'flex',
    justifyContent: 'center',
    boxShadow: shadows[1],
  },
  postTitle: { fontSize: typography.h4.fontSize },
}))

export const getServerSideProps = async () => {
  return { props: {} }
}

export default NewPost
