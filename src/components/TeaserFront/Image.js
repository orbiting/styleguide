import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { mUp, dUp } from './mediaQueries'
import Image from '../Figure/Image'
import Text from './Text'

const styles = {
  container: css({
    position: 'relative',
    lineHeight: 0,
    margin: 0,
    [dUp]: {
      background: 'none'
    }
  }),
  textContainer: css({
    padding: '15px',
    [mUp]: {
      padding: '40px 15% 70px 15%'
    },
    [dUp]: {
      padding: 0
    }
  })
}

const ImageBlock = ({
  children,
  attributes,
  image,
  alt,
  onClick,
  color,
  bgColor,
  textPosition,
  center
}) => {
  const background = bgColor || ''
  return (
    <div {...attributes} {...styles.container} onClick={onClick} style={{
      background,
      cursor: onClick ? 'pointer' : 'default'
    }}>
      <Image src={image} alt={alt} />
      <div {...styles.textContainer}>
        <Text position={textPosition} color={color} center={center}>
          {children}
        </Text>
      </div>
    </div>
  )
}

ImageBlock.propTypes = {
  children: PropTypes.node.isRequired,
  attributes: PropTypes.object,
  image: PropTypes.string.isRequired,
  alt: PropTypes.string,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  center: PropTypes.bool,
  textPosition: PropTypes.oneOf([
    'topleft',
    'topright',
    'bottomleft',
    'bottomright'
  ])
}

ImageBlock.defaultProps = {
  textPosition: 'topleft',
  alt: ''
}

export default ImageBlock
