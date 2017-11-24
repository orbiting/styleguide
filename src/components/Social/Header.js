import React from 'react'
import { css } from 'glamor'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import colors from '../../theme/colors'
import { mUp } from '../../theme/mediaQueries'
import { sansSerifMedium16, sansSerifRegular14 } from '../Typography/styles'
import { ellipsize } from '../../lib/styleMixins'

export const profilePictureSize = 40
export const profilePictureMargin = 10
const profilePictureBorderSize = 5

const styles = {
  root: css({
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  }),
  profilePicture: css({
    display: 'block',
    width: `${profilePictureSize + 2 * profilePictureBorderSize}px`,
    flexGrow: 0,
    flexShrink: 0,
    height: `${profilePictureSize + 2 * profilePictureBorderSize}px`,
    margin: `${-profilePictureBorderSize}px ${-profilePictureBorderSize +
      profilePictureMargin}px ${-profilePictureBorderSize}px ${-profilePictureBorderSize}px`,
    border: `${profilePictureBorderSize}px solid white`
  }),
  meta: css({
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: `calc(100% - ${profilePictureSize + profilePictureMargin}px)`
  }),
  name: css({
    ...sansSerifMedium16,
    lineHeight: '20px',
    color: colors.text,
    display: 'flex',
    alignItems: 'center',
    paddingRight: '15px'
  }),
  nameText: css({
    ...ellipsize
  }),
  subline: css({
    ...sansSerifRegular14,
    lineHeight: '20px',
    color: colors.text,
    display: 'flex',
    alignItems: 'center'
  }),
  sublineText: css({
    ...ellipsize
  }),
  icon: css({
    color: '#CDCDCD',
    position: 'absolute',
    right: 0,
    top: '2px',
    flexShrink: 0,
    display: 'inline-block',
    marginLeft: 4,
    fontSize: '17px',
    [mUp]: {
      fontSize: '24px',
      top: '8px'
    }
  }),
  link: css({
    textDecoration: 'none',
    color: colors.text,
    ':visited': {
      color: colors.text
    },
    ':hover': {
      color: colors.lightText
    }
  })
}

const Link = ({ href, children }) => (
  <a href={href} target="_blank" {...styles.link}>
    {children}
  </a>
)

const UserLink = ({ handle, children }) => (
  <Link href={`https://twitter.com/${handle}`}>{children}</Link>
)

export const Header = ({ url, profilePicture, name, handle, date }) => {
  handle = handle.replace('@', '')
  return (
    <div {...styles.root}>
      <UserLink handle={handle}>
        <img {...styles.profilePicture} src={profilePicture} alt="" />
      </UserLink>
      <Link href={url}>
        <TwitterIcon {...styles.icon} />
      </Link>
      <div {...styles.meta}>
        <div {...styles.name}>
          <div {...styles.nameText}>
            <UserLink handle={handle}>{name}</UserLink>
          </div>
        </div>
        <div {...styles.subline}>
          <div {...styles.sublineText}>
            <UserLink handle={handle}>@{handle}</UserLink>,{' '}
            <Link href={url}>{date}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
