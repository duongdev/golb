import React from 'react'
import { Box, Paper, Grid, Typography, makeStyles } from '@material-ui/core'
import moment from 'moment'
import UserDisplay from './UserDisplay'
import Link from 'next/link'

const PostGridItem = ({ post }) => {
  const classes = useStyles()
  const { title, plainText, createdBy } = post
  return (
    <Box component={Paper} padding={2} data-testid="post-grid-item">
      <Grid container spacing={2} direction="column" wrap="nowrap">
        <Grid item>
          <UserDisplay
            {...createdBy}
            subtitle={
              <Typography variant="body2" color="textSecondary">
                {moment(post.createdAt).fromNow()}
              </Typography>
            }
          />
        </Grid>
        <Grid item>
          <Link
            passHref
            href="/posts/[postSlugOrId]"
            as={`/posts/${post.slug}`}
          >
            <Typography
              variant="h4"
              component="a"
              title={title}
              className={classes.titleContent}
            >
              {title}
            </Typography>
          </Link>
        </Grid>
        {plainText && (
          <Grid item>
            <Link
              passHref
              href="/posts/[postSlugOrId]"
              as={`/posts/${post.slug}`}
            >
              <Typography
                variant="body1"
                color="textSecondary"
                component="a"
                className={classes.titleContent}
              >
                {plainText}
              </Typography>
            </Link>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  titleContent: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
}))

export default PostGridItem
