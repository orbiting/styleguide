import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { mUp, tUp } from './mediaQueries'
import colors from '../../theme/colors'
import zIndex from '../../theme/zIndex'
import { FigureImage, FigureByline } from '../Figure'
import Text from './Text'

const containerStyle = {
  position: 'relative',
  lineHeight: 0,
  margin: 0,
  zIndex: zIndex.frontImage,
  [tUp]: {
    background: 'none'
  }
}

const textContainerStyle = {
  overflow: 'hidden',  // Hides unpositioned content on mobile.
  padding: '15px 15px 40px 15px',
  [mUp]: {
    padding: '40px 15% 70px 15%'
  },
  [tUp]: {
    padding: 0
  }
}

const styles = {
  container: css({
    ...containerStyle
  }),
  containerFramed: css({
    ...containerStyle,
    margin: '15px',
    [mUp]: {
      background: 'none',
      margin: '50px 5%'
    }
  }),
  textContainer: css({
    ...textContainerStyle
  }),
  textContainerFramed: css({
    ...textContainerStyle,
    padding: '15px 0 40px 0',
    [mUp]: {
      padding: '40px 0 70px 0'
    },
    [tUp]: {
      padding: 0
    }
  })
}

const ImageBlock = ({
  children,
  attributes,
  image,
  byline,
  alt,
  onClick,
  color,
  compactColor,
  bgColor,
  textPosition,
  center,
  aboveTheFold,
  onlyImage,
  framed
}) => {
  const background = bgColor || ''
  return (
    <div {...attributes} {...(framed ? styles.containerFramed : styles.container)} onClick={onClick} style={{
      background,
      cursor: onClick ? 'pointer' : 'default'
    }}>
      <div style={{position: 'relative', fontSize: 0}}>
        <FigureImage aboveTheFold={aboveTheFold} {...FigureImage.utils.getResizedSrcs(image, 1500, false)} alt={alt} />
        {byline && <FigureByline position={onlyImage ? 'leftInsideOnlyImage' : 'leftInside'} style={{color}}>
          {byline}
        </FigureByline>}
      </div>
      {!onlyImage && <div {...(framed ? styles.textContainerFramed : styles.textContainer)}>
        <Text position={textPosition} color={color} compactColor={framed && colors.text} center={center}>
          {children}
        </Text>
      </div>}
    </div>
  )
}

ImageBlock.propTypes = {
  children: PropTypes.node.isRequired,
  attributes: PropTypes.object,
  image: PropTypes.string.isRequired,
  byline: PropTypes.string,
  alt: PropTypes.string,
  color: PropTypes.string,
  compactColor: PropTypes.string,
  bgColor: PropTypes.string,
  center: PropTypes.bool,
  textPosition: PropTypes.oneOf([
    'topleft',
    'topright',
    'bottomleft',
    'bottomright',
    'top',
    'middle',
    'bottom'
  ]),
  onlyImage: PropTypes.bool,
  framed: PropTypes.bool
}

ImageBlock.defaultProps = {
  textPosition: 'topleft',
  alt: '',
  onlyImage: false
}

export default ImageBlock
