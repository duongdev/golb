import React from 'react'
import { Grid } from '@material-ui/core'
import CommentInput from './CommentInput'

const Comments = () => {
  return (
    <Grid container spacing={4} direction="column" wrap="nowrap">
      <Grid item>
        <CommentInput />
      </Grid>
      <Grid item>Comment List</Grid>
    </Grid>
  )
}

export default Comments
