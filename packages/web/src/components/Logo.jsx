import React from 'react'
import { makeStyles } from '@material-ui/core'
import Link from 'next/link'
import { LOGO_HEIGHT } from 'constants/ui'

const Logo = (props) => {
  const classes = useStyles(props)
  return (
    <Link href="/">
      <a className={classes.root}>GLOB</a>
    </Link>
  )
}

const useStyles = makeStyles(({ palette, spacing, shape, typography }) => ({
  root: {
    backgroundColor: palette.common.black,
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    borderRadius: shape.borderRadius,
    color: palette.common.white,
    fontSize: typography.body1.fontSize,
    fontWeight: 'bold',
    textDecoration: 'none',
    height: LOGO_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    letterSpacing: typography.button.letterSpacing,
  },
}))

export default Logo
