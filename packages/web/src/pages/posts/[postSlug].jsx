import React from 'react'
import Layout from 'components/Layout'
import {
  makeStyles,
  Container,
  Grid,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@material-ui/core'
import Error from 'next/error'
import { createClient } from 'api-client'
import TextEditor from 'components/Editor'
import UserDisplay from 'components/UserDisplay'
import moment from 'moment'
import { DotsVertical } from 'mdi-material-ui'
import { useMemo } from 'react'
import { useAuth } from 'contexts/AuthContext'
import { useState } from 'react'
import Link from 'next/link'

const PostView = (props) => {
  const { post } = props
  useStyles(props)
  const currentUser = useAuth()

  const isPostAuthor = useMemo(() => post?.createdBy?.id === currentUser?.id, [
    currentUser.id,
    post.createdBy.id,
  ])

  if (!post) {
    return <Error statusCode={props.errorCode ?? 500} />
  }

  return (
    <Layout title={post.title}>
      <Container maxWidth="md">
        <Grid container spacing={4} direction="column" wrap="nowrap">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12} sm>
                <Typography gutterBottom variant="h3">
                  <strong>{post.title}</strong>
                </Typography>
              </Grid>
              {isPostAuthor && (
                <Grid item>
                  <ManagePostActions postId={post.id} />
                </Grid>
              )}
            </Grid>
          </Grid>

          {post.createdBy && (
            <Grid item>
              <UserDisplay
                name={post.createdBy.name}
                avatar={post.createdBy.avatar}
                username={post.createdBy.username}
                avatarSize={48}
                spacing={2}
                subtitle={
                  <Typography variant="body2" color="textSecondary">
                    {moment(post.createdAt).fromNow()}
                  </Typography>
                }
              />
            </Grid>
          )}

          <Grid item>
            <TextEditor readOnly value={post.content} />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}

const ManagePostActions = (props) => {
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <>
      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        <DotsVertical />
      </IconButton>
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem>
          <Link
            passHref
            href="/posts/edit/[postId]"
            as={`/posts/edit/${props.postId}`}
          >
            <Box display="flex" component="a" alignItems="center">
              Edit this post
            </Box>
          </Link>
        </MenuItem>
        <MenuItem>
          <Typography color="error">Delete this post</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const client = createClient(ctx)

  try {
    const { data } = await client.get(`/posts/${ctx.query.postSlug}`)

    return { props: { post: data ?? null } }
  } catch (error) {
    return { props: { post: null, errorCode: error.response.status } }
  }
}

const useStyles = makeStyles(({ palette }) => ({
  '@global': {
    body: {
      background: palette.background.paper,
    },
  },
}))

export default PostView
