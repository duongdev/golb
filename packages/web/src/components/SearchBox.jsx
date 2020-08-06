import React, { useRef } from 'react'
import {
  makeStyles,
  TextField,
  InputAdornment,
  IconButton,
} from '@material-ui/core'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Close } from 'mdi-material-ui'

const SearchBox = (props) => {
  // eslint-disable-next-line no-unused-vars
  const classes = useStyles(props)
  const router = useRouter()
  const [value, setValue] = useState(router.query.searchText || '')
  const inputRef = useRef()

  const handleKeyDown = useCallback(
    (event) => {
      // Press Enter
      if (event.keyCode === 13 && props.onSearch) {
        props.onSearch(event.target.value)
      }
    },
    [props],
  )

  const handleChange = useCallback((event) => {
    setValue(event.target.value)
  }, [])
  const handleClearValue = useCallback(() => {
    setValue('')
    // eslint-disable-next-line no-unused-expressions
    props.onSearch?.()
    // eslint-disable-next-line no-unused-expressions
    inputRef.current?.focus()
  }, [props])

  return (
    <TextField
      placeholder="Search..."
      variant="outlined"
      size="small"
      onKeyDown={handleKeyDown}
      value={value}
      onChange={handleChange}
      InputProps={{
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClearValue}>
              <Close fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
        inputRef,
      }}
    />
  )
}

const useStyles = makeStyles(() => ({}))

export default SearchBox
