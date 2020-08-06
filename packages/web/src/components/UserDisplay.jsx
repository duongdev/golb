import React from 'react'
import { Grid, Typography, Avatar } from '@material-ui/core'
// import Link from 'next/link'

const UserDisplay = ({
  name,
  avatar,
  username,
  avatarSize,
  subtitle,
  spacing,
  disableName,
  disableAvatar,
  nameVariant,
}) => {
  return (
    <Grid alignItems="center" container spacing={spacing}>
      {!disableAvatar && (
        <Grid item>
          {/* <Link passHref href="/users/[username]" as={`/users/${username}`}> */}
            <Avatar
              style={{ height: avatarSize, width: avatarSize }}
              src={avatar}
              // component="a"
            />
          {/* </Link> */}
        </Grid>
      )}
      {!disableName && (
        <Grid item>
          {/* <Link passHref href="/users/[username]" as={`/users/${username}`}> */}
            <Typography
              // component="a"
              variant={nameVariant}
              style={{ whiteSpace: 'nowrap' }}
            >
              {name || username || '[no name]'}
            </Typography>
          {/* </Link> */}
          {subtitle}
        </Grid>
      )}
    </Grid>
  )
}

UserDisplay.defaultProps = {
  avatarSize: 40,
  spacing: 1,
}

export default UserDisplay
