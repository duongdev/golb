import React from 'react'
import { Grid, TextField, Button, Typography } from '@material-ui/core'
import UserDisplay from './UserDisplay'
import { useAuth } from 'contexts/AuthContext'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { object, string, boolean } from 'yup'

const CommentInput = () => {
  const router = useRouter()
  const user = useAuth()

  const handleSubmit = useCallback(async () => {}, [])

  const formik = useFormik({
    onSubmit: handleSubmit,
    initialValues: { content: '', editing: false },
    validationSchema: object().shape({
      content: string().label('Comment content').min(10),
      editing: boolean().oneOf([true]),
    }),
  })

  const handleInputFocus = useCallback(() => {
    if (!user) {
      return router.push(`/auth?redirect=${encodeURIComponent(router.asPath)}`)
    }
    formik.setFieldValue('editing', true)
  }, [formik, router, user])

  return (
    <Grid container spacing={2}>
      <Grid item>
        <UserDisplay
          disabledName
          name={user.name}
          username={user.username}
          avatar={user.avatar}
        />
      </Grid>
      <Grid item xs>
        <Grid container spacing={1} justify="flex-end">
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              placeholder="Add a public comment..."
              fullWidth
              multiline
              onFocus={handleInputFocus}
              value={formik.values.content}
              onChange={(e) => formik.setFieldValue('content', e.target.value)}
              error={!!(formik.submitCount && formik.errors.content)}
              // helperText={formik.errors.content}
            />
          </Grid>
          {formik.dirty && (
            <>
              {formik.errors.content && (
                <Grid item xs>
                  <Typography
                    variant="caption"
                    color={formik.submitCount ? 'error' : 'textSecondary'}
                  >
                    {formik.errors.content}
                  </Typography>
                </Grid>
              )}
              <Grid item>
                <Button onClick={() => formik.resetForm()}>Cancel</Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => formik.submitForm()}
                >
                  Comment
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CommentInput
