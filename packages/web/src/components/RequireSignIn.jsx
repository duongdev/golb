import React from 'react'
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  NoSsr,
} from '@material-ui/core'
import { Twitter, Github } from 'mdi-material-ui'
import qs from 'querystring'
import { GH_CLIENT_ID } from 'constants/common'
import { useRouter } from 'next/router'

const RequireSignIn = ({ redirect, message }) => {
  const router = useRouter()
  return (
    <NoSsr>
      <Container maxWidth="sm">
        <Grid container spacing={2} direction-="column" wrap="nowrap">
          <Grid item xs={12}>
            <Box component={Paper} padding={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" align="center">
                    {message ??
                      'Sign in below to compose your post and share it with the community.'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    size="large"
                    color="primary"
                    variant="contained"
                    startIcon={<Github />}
                    style={{ backgroundColor: '#242a2f' }}
                    component="a"
                    href={`https://github.com/login/oauth/authorize?${qs.stringify(
                      {
                        client_id: GH_CLIENT_ID,
                        redirect_uri:
                          typeof window !== 'undefined' &&
                          `${window.location.protocol}//${
                            window.location.host
                          }/auth?${qs.stringify({
                            provider: 'github',
                            redirect: redirect ?? router.pathname,
                          })}`,
                      },
                    )}`}
                  >
                    Sign in with GitHub
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    size="large"
                    color="primary"
                    variant="contained"
                    startIcon={<Twitter />}
                    // style={{ backgroundColor: '#1da1f2' }}
                    disabled
                  >
                    Twitter (coming soon)
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary" align="center">
                    We require social registration to prevent abuse.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </NoSsr>
  )
}

export default RequireSignIn
