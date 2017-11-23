import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import colors from '../../theme/colors'
import { mUp } from '../../theme/mediaQueries'
import { sansSerifRegular15, sansSerifRegular18 } from '../Typography/styles'
import { Figure } from '../Figure'
import Image from '../Figure/Image'
import { Header } from './Header'

const styles = {
  container: css({
    display: 'block',
    textDecoration: 'none',
    borderBottom: `1px solid ${colors.text}`,
    borderTop: `1px solid ${colors.text}`,
    margin: '36px auto',
    paddingTop: '10px',
    position: 'relative',
    maxWidth: '455px',
    [mUp]: {
      margin: '45px auto',
      paddingTop: '10px'
    }
  }),
  text: css({
    ...sansSerifRegular15,
    [mUp]: {
      ...sansSerifRegular18
    },
    color: colors.text
  })
}

const Embed = ({
  children,
  attributes,
  platform,
  url,
  authorName,
  subline,
  profilePicture,
  image
}) => {
  return (
    <a {...styles.container} href={url} target="_blank">
      <Header
        platform={platform}
        profilePicture={profilePicture}
        authorName={authorName}
        subline={subline}
      />
      <p {...styles.text}>{children}</p>
      {image && (
        <Figure>
          <Image src={image} alt="" />
        </Figure>
      )}
    </a>
  )
}

Embed.propTypes = {
  children: PropTypes.node.isRequired,
  attributes: PropTypes.object,
  platform: PropTypes.oneOf(['twitter', 'facebook']).isRequired,
  url: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  subline: PropTypes.string.isRequired,
  profilePicture: PropTypes.string.isRequired,
  image: PropTypes.string
}

Embed.defaultProps = {
  platform: 'twitter'
}

export default Embed
