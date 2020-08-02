import React from 'react'
import Layout from 'components/Layout'
import { makeStyles, Container, Grid, Typography } from '@material-ui/core'
import Error from 'next/error'
import { createClient } from 'api-client'
import TextEditor from 'components/Editor'
import UserDisplay from 'components/UserDisplay'
import moment from 'moment'

const PostView = (props) => {
  useStyles(props)

  const { post } = props

  if (!post) {
    return <Error statusCode={props.errorCode ?? 500} />
  }

  console.log(post)
  return (
    <Layout title={post.title}>
      <Container maxWidth="md">
        <Grid container spacing={4} direction="column" wrap="nowrap">
          <Grid item>
            <Typography gutterBottom variant="h3">
              <strong>{post.title}</strong>
            </Typography>
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
