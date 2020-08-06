import React from 'react'

import {
  AppBar as MuiAppBar,
  makeStyles,
  Container,
  Grid,
  Button,
  Avatar,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import Logo from './Logo'
import SearchBox from './SearchBox'
import { APP_BAR_HEIGHT } from 'constants/ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useAuth } from 'contexts/AuthContext'
import { destroyCookie } from 'nookies'
import { TOKEN_COOKIE } from 'constants/common'

const AppBar = (props) => {
  const classes = useStyles(props)
  const router = useRouter()
  const user = useAuth()

  const handleSearch = useCallback(
    (searchText) => {
      router.push(searchText ? `/?searchText=${searchText}` : '/')
    },
    [router],
  )

  const handleSignOut = useCallback(() => {
    destroyCookie(null, TOKEN_COOKIE)
    router.reload()
  }, [router])

  return (
    <MuiAppBar color="transparent" position="fixed" className={classes.root}>
      <Container maxWidth={false}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Logo />
          </Grid>
          <Grid item>
            <SearchBox onSearch={handleSearch} />
          </Grid>
          <Grid item xs />
          <Grid item>
            <Link href="/posts/new" passHref>
              <Button variant="contained" color="primary" component="a">
                Write a post
              </Button>
            </Link>
          </Grid>
          {user && (
            <Grid item>
              <Tooltip title="Click to sign out">
                <IconButton size="small" onClick={handleSignOut}>
                  <Avatar src={user.avatar} />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </Container>
    </MuiAppBar>
  )
}

const useStyles = makeStyles(({ shadows }) => ({
  root: {
    background: 'hsla(0,0%,100%,.6)',
    backdropFilter: 'blur(3px)',
    height: APP_BAR_HEIGHT,
    display: 'flex',
    justifyContent: 'center',
    boxShadow: shadows[1],
  },
}))

export default AppBar
