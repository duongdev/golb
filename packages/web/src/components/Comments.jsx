import React, { useState, useCallback } from 'react'
import { Grid, Typography, Box } from '@material-ui/core'
import CommentInput from './CommentInput'
import { createClient } from 'api-client'
import { useEffect } from 'react'
import { useMemo } from 'react'
import Pagination from '@material-ui/lab/Pagination'
import CommentItem from './CommentItem'

const Comments = ({ targetId }) => {
  const [pagedComments, setPagedComments] = useState(null)
  const [loading, setLoading] = useState(false)

  const comments = useMemo(() => pagedComments?.docs ?? [], [pagedComments])

  const getComments = useCallback(
    async ({ page = 1, limit = 10 } = {}) => {
      setLoading(true)

      try {
        const client = createClient()
        const { data: paginatedComments } = await client.get(
          `/comments/${targetId}`,
          {
            params: {
              page,
              limit,
            },
          },
        )
        setPagedComments(paginatedComments)
      } catch (error) {}

      setLoading(false)
    },
    [targetId],
  )

  const handleCreateComment = useCallback(
    async (content) => {
      try {
        const client = createClient()
        const comment = await client.post(`/comments/${targetId}`, { content })
        await getComments()
        return comment
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    [getComments, targetId],
  )

  useEffect(() => {
    getComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={4} direction="column" wrap="nowrap">
      <Grid item>
        <CommentInput onSubmit={handleCreateComment} />
      </Grid>
      <Grid item>
        {comments.length > 0 ? (
          <Grid container spacing={2} direction="column" wrap="nowrap">
            {comments.map((comment) => (
              <Grid item key={comment.id}>
                <CommentItem comment={comment} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center">
            There is no comments on this post yet.
          </Typography>
        )}
      </Grid>
      {(pagedComments?.totalPages ?? 0) > 1 && (
        <Grid item>
          <Box display="flex" justifyContent="center">
            <Pagination
              page={pagedComments.page}
              count={pagedComments.totalPages}
              onChange={(e, page) => getComments({ page })}
            />
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

export default Comments
