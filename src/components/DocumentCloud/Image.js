import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

const styles = {
  image: css({
    width: '100%',
    display: 'block'
  }),
  imageWrapper: css({
    display: 'block',
    position: 'relative',
    '::after': {
      position: 'absolute',
      background: 'rgba(255, 255, 255, .6)',
      content: ' ',
      height: '100%',
      width: '100%',
      top: 0
    }
  }),
  maxWidth: css({
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  })
}

class Image extends Component {
  render() {
    const {
      src,
      srcSet,
      alt,
      attributes = {},
      maxWidth,
    } = this.props

    const image = 
      <span {...styles.imageWrapper}>
        <img {...attributes} {...styles.image} src={src} srcSet={srcSet} alt={alt} />
      </span>

    if (maxWidth) {
      return (
        <span {...styles.maxWidth} style={{maxWidth}}>
          {image}
        </span>
      )
    }
    return image
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  alt: PropTypes.string,
  maxWidth: PropTypes.number,
  aspectRatio: PropTypes.number
}


export default Image
