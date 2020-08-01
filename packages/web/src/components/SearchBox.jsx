import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'

const SearchBox = (props) => {
  const classes = useStyles(props)
  return <TextField placeholder="Search..." variant="outlined" size="small" />
}

const useStyles = makeStyles(() => ({}))

export default SearchBox
