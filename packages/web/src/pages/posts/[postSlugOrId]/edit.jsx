import React, { useRef } from 'react'
import { createClient } from 'api-client'
import { useMemo } from 'react'
import Error from 'next/error'
import {
  makeStyles,
  Container,
  AppBar as MuiAppBar,
  Grid,
  Button,
  Box,
  TextField,
} from '@material-ui/core'
import { APP_BAR_HEIGHT } from 'constants/ui'
import Logo from 'components/Logo'
import Layout from 'components/Layout'
import { Formik } from 'formik'
import * as yup from 'yup'
import dynamic from 'next/dynamic'
import { useCallback } from 'react'
import { useRouter } from 'next/router'

const Editor = dynamic(() => import('components/Editor'), {
  ssr: false,
})

// TODO: Refactor together with CreatePost page
const PostEdit = (props) => {
  const classes = useStyles(props)
  const { post, user, errorCode } = props
  const editorRef = useRef(null)
  const router = useRouter()

  const isPostAuthor = useMemo(() => post?.createdBy.id === user?.id, [
    post,
    user,
  ])

  const handleSubmit = useCallback(
    async (values, formik) => {
      const client = createClient()

      const plainText = editorRef.current?.innerText
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ')

      const { data: updatedPost } = await client.post(`/posts/${post.id}`, {
        title: values.title,
        content: values.content,
        plainText,
      })

      if (updatedPost && updatedPost.slug) {
        router.push(`/posts/[postSlugOrId]`, `/posts/${updatedPost.slug}`)
      }
    },
    [post, router],
  )

  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  if (!isPostAuthor) {
    return <Error statusCode={403} />
  }

  return (
    <Layout title="Write a new post" disableAppBar={user}>
      <Formik
        onSubmit={handleSubmit}
        initialValues={{
          title: post.title,
          content: post.content,
        }}
        validationSchema={yup.object().shape({
          title: yup.string().trim().min(1).required(),
          content: yup.mixed().required(),
        })}
      >
        {(formik) => (
          <>
            <AppBar
              onSubmit={() => formik.submitForm()}
              disabled={!formik.isValid || formik.isSubmitting || !formik.dirty}
            />
            <Container maxWidth="md">
              <Box display="flex" alignItems="center" justifyContent="center">
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
              Save your post
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

export const getServerSideProps = async (ctx) => {
  const client = createClient(ctx)

  try {
    const { data } = await client.get(`/posts/${ctx.query.postSlugOrId}`)

    return { props: { post: data ?? null } }
  } catch (error) {
    return { props: { post: null, errorCode: error?.response?.status } }
  }
}

export default PostEdit
