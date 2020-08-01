import React from 'react'

import {
  AppBar as MuiAppBar,
  makeStyles,
  Container,
  Grid,
  Button,
} from '@material-ui/core'
import Logo from './Logo'
import SearchBox from './SearchBox'
import { APP_BAR_HEIGHT } from 'constants/ui'
import Link from 'next/link'

const AppBar = (props) => {
  const classes = useStyles(props)
  return (
    <MuiAppBar color="transparent" position="fixed" className={classes.root}>
      <Container maxWidth={false}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Logo />
          </Grid>
          <Grid item>
            <SearchBox />
          </Grid>
          <Grid item xs />
          <Grid item>
            <Link href="/posts/new" passHref>
              <Button variant="contained" color="primary" component="a">
                Write a post
              </Button>
            </Link>
          </Grid>
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
