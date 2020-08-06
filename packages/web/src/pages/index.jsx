import React from 'react'
import Layout from 'components/Layout'
import { createClient } from 'api-client'
import { Container, Grid, Typography, Box } from '@material-ui/core'
import PostGridItem from 'components/PostGridItem'
import Pagination from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'
import { useRouter } from 'next/router'
import qs from 'querystring'
import Link from 'next/link'

export default function Home(props) {
  const router = useRouter()

  return (
    <Layout>
      <Container maxWidth="sm">
        <Grid container spacing={2} direction="column" wrap="nowrap">
          {props.data.docs.length === 0 && (
            <Grid item>
              <Typography align="center" color="textSecondary">
                {props.data.searchText ? (
                  <>
                    Couldn't find any posts relevant to{' '}
                    <strong>{props.data.searchText}</strong>.
                  </>
                ) : (
                  'There is no posts created yet.'
                )}
              </Typography>
            </Grid>
          )}
          {props.data.docs.length > 0 && props.data.searchText && (
            <Grid item>
              <Typography color="textPrimary">
                Yay! Found <strong>{props.data.totalDocs}</strong> post(s)
                relevant to <strong>{props.data.searchText}</strong>.
              </Typography>
            </Grid>
          )}
          {props.data.docs.map((post) => (
            <Grid item key={post._id}>
              <PostGridItem post={post} />
            </Grid>
          ))}

          {props.data.totalPages > 1 && (
            <Grid item>
              <Box display="flex" justifyContent="center">
                <Pagination
                  color="primary"
                  count={props.data.totalPages}
                  page={props.data.page}
                  renderItem={(item) => (
                    <Link
                      passHref
                      href={`/?${qs.stringify({
                        ...router.query,
                        page: item.page,
                      })}`}
                      as={`/?${qs.stringify({
                        ...router.query,
                        page: item.page,
                      })}`}
                    >
                      <PaginationItem component="a" {...item} />
                    </Link>
                  )}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const client = createClient(ctx)
  const { page = 1, searchText } = ctx.query

  const { data } = await client.get(`/posts`, {
    params: { page: +page, searchText },
  })

  return { props: { data } }
}
