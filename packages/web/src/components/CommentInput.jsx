import React, { useCallback } from 'react'
import { Grid, TextField, Button, Typography } from '@material-ui/core'
import UserDisplay from './UserDisplay'
import { useAuth } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { object, string, boolean } from 'yup'

const CommentInput = (props) => {
  const router = useRouter()
  const user = useAuth()

  const handleSubmit = useCallback(
    async ({ content }, formik) => {
      try {
        await props.onSubmit?.(content)
        formik.resetForm()
      } catch (error) {
        formik.setFieldError('content', error.message)
      }
    },
    [props],
  )

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
          disableName
          name={user?.name}
          username={user?.username}
          avatar={user?.avatar}
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
              disabled={formik.isSubmitting}
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
                <Button
                  disabled={formik.isSubmitting}
                  onClick={() => formik.resetForm()}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => formik.submitForm()}
                  disabled={formik.isSubmitting || !formik.isValid}
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
