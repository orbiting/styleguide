import React from 'react'
import { css } from 'glamor'

import LazyLoad from './'

const styles = {
  container: css({
    display: 'block',
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.1)'
  }),
  img: css({
    display: 'block',
    position: 'absolute',
    width: '100%'
  })
}

export default ({
  src,
  srcNeg,
  srcSet,
  sizes,
  alt,
  aspectRatio,
  attributes,
  visible,
  offset,
  onClick
}) => (
  <LazyLoad
    attributes={{ ...styles.container, ...attributes }}
    offset={offset}
    visible={visible}
    style={{
      // We always subtract 1px to prevent against rounding issues that can lead
      // to the background color shining through at the bottom of the image.
      paddingBottom: `calc(${100 / aspectRatio}% - 1px)`,
      backgroundColor:
        src.match(/\.png(\.webp)?(\?|$)/) || src.match(/\.gif(\.webp)?(\?|$)/)
          ? 'transparent'
          : undefined
    }}
  >
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      {...styles.img}
      onClick={onClick}
      className={srcNeg && 'img-standard'}
    />
    {srcNeg && (
      <img
        src={srcNeg}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        {...styles.img}
        onClick={onClick}
        className='img-negative'
      />
    )}
  </LazyLoad>
)
