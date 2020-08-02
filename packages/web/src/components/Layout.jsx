import React from 'react'
import PropTypes from 'prop-types'
import AppBar from './AppBar'
import { makeStyles } from '@material-ui/core'
import { APP_BAR_HEIGHT } from 'constants/ui'
import Head from 'next/head'

const Layout = (props) => {
  const classes = useStyles(props)

  return (
    <div className={classes.root}>
      <Head>{props.title && <title>{props.title}</title>}</Head>
      {!props.disableAppBar && <AppBar />}
      {props.children}
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginTop: APP_BAR_HEIGHT + spacing(4),
    marginBottom: spacing(4),
  },
}))

Layout.propTypes = {
  title: PropTypes.string,
}

export default Layout
