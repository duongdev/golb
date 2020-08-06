import React from 'react'
import { Grid, Typography, Box } from '@material-ui/core'
import UserDisplay from './UserDisplay'
import moment from 'moment'

const CommentItem = ({ comment }) => {
  return (
    <Grid container spacing={2}>
      <Grid item>
        <UserDisplay
          avatar={comment.createdBy.avatar}
          username={comment.createdBy.username}
          disableName
        />
      </Grid>
      <Grid item xs>
        <Grid container direction="column" wrap="nowrap">
          <Grid item>
            <Box display="flex" alignItems="baseline">
              <Box mr={1}>
                <UserDisplay
                  avatar={comment.createdBy.avatar}
                  username={comment.createdBy.username}
                  name={comment.createdBy.name}
                  nameVariant="subtitle2"
                  disableAvatar
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {moment(comment.createdAt).fromNow()}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Typography>{comment.content}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CommentItem
