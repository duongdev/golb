import React from 'react'

import {
  AppBar as MuiAppBar,
  makeStyles,
  Container,
  Grid,
  Button,
  Avatar,
  IconButton,
  Hidden,
  Box,
  Menu,
  MenuItem,
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
import { useState } from 'react'

const AppBar = (props) => {
  const classes = useStyles(props)
  const router = useRouter()

  const handleSearch = useCallback(
    (searchText) => {
      router.push(searchText ? `/?searchText=${searchText}` : '/')
    },
    [router],
  )

  return (
    <MuiAppBar color="transparent" position="fixed" className={classes.root}>
      <Container maxWidth={false}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Logo />
          </Grid>
          <Grid item xs>
            <Box maxWidth={320}>
              <SearchBox onSearch={handleSearch} />
            </Box>
          </Grid>
          <Hidden xsDown>
            <>
              <Grid item xs />
              <Grid item>
                <Link href="/posts/new" passHref>
                  <Button variant="contained" color="primary" component="a">
                    Write a post
                  </Button>
                </Link>
              </Grid>
            </>
          </Hidden>
          <Grid item>
            <UserMenu />
          </Grid>
        </Grid>
      </Container>
    </MuiAppBar>
  )
}

const UserMenu = () => {
  const router = useRouter()
  const user = useAuth()
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const handleSignOut = useCallback(() => {
    destroyCookie(null, TOKEN_COOKIE, { path: '/' })

    setTimeout(() => router.reload(), 500)
  }, [router])

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setMenuAnchorEl(e.currentTarget)}
      >
        <Avatar src={user?.avatar} />
      </IconButton>
      <Menu
        open={!!menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        anchorEl={menuAnchorEl}
      >
        {!user && (
          <MenuItem
            onClick={() =>
              router.push(`/auth?redirect=${encodeURIComponent(router.asPath)}`)
            }
          >
            Sign in
          </MenuItem>
        )}
        <MenuItem onClick={() => router.push('/posts/new')}>
          Write new post
        </MenuItem>
        {user && <MenuItem onClick={handleSignOut}>Sign out</MenuItem>}
      </Menu>
    </>
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
