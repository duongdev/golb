import React from 'react'
import Layout from 'components/Layout'
import RequireSignIn from 'components/RequireSignIn'
import { useAuth } from 'contexts/AuthContext'
import {
  Container,
  Grid,
  TextField,
  Box,
  AppBar as MuiAppBar,
  makeStyles,
  Button,
} from '@material-ui/core'
import dynamic from 'next/dynamic'
import { APP_BAR_HEIGHT } from 'constants/ui'
import Logo from 'components/Logo'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useCallback } from 'react'

const Editor = dynamic(() => import('components/Editor'), {
  ssr: false,
})

const NewPost = () => {
  const classes = useStyles()
  const user = useAuth()

  const handleSubmit = useCallback(async (values, formik) => {
    console.log(values)
  }, [])

  return (
    <Layout title="Write a new post" disableAppBar={user}>
      {user ? (
        <Formik
          onSubmit={handleSubmit}
          initialValues={{
            title: '',
            content: null,
          }}
          validationSchema={yup.object().shape({
            title: yup.string().required().min(5).max(70),
            content: yup.mixed().required(),
          })}
        >
          {(formik) => (
            <>
              <AppBar
                onSubmit={() => formik.submitForm()}
                disabled={!formik.isValid}
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
                        style={{ maxWidth: 650 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Editor
                        value={formik.values.content}
                        onChange={(content) =>
                          formik.setFieldValue('content', content)
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Container>
            </>
          )}
        </Formik>
      ) : (
        <RequireSignIn />
      )}
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
