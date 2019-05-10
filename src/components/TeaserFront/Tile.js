import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { mUp } from '../../theme/mediaQueries'
import { breakoutUp } from '../Center'
import Text from './Text'
import colors from '../../theme/colors'

import { FigureImage, FigureByline } from '../Figure'
import LazyLoad from '../LazyLoad'

// Row

const IMAGE_SIZE = {
  tiny: 180,
  small: 220,
  medium: 300,
  large: 360
}

const sizeTiny = {
  maxHeight: `${IMAGE_SIZE.tiny}px`,
  maxWidth: `${IMAGE_SIZE.tiny}px`
}

const sizeSmall = {
  maxHeight: `${IMAGE_SIZE.small}px`,
  maxWidth: `${IMAGE_SIZE.small}px`
}

const sizeMedium = {
  maxHeight: `${IMAGE_SIZE.medium}px`,
  maxWidth: `${IMAGE_SIZE.medium}px`
}

const sizeLarge = {
  maxHeight: `${IMAGE_SIZE.large}px`,
  maxWidth: `${IMAGE_SIZE.large}px`
}

const tileRowStyles = {
  row: css({
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    [mUp]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    '& .tile': {
      boxSizing: 'border-box',
      borderTop: `1px solid ${colors.divider}`,
      margin: '0 0 50px 0',
      padding: '20px 0'
    },
  }),
  rowReverse: css({
    flexDirection: 'column-reverse',
  }),
  colEven: css({
    '& img': {
      ...sizeSmall
    },
    [mUp]: {
      '& .tile': {
        borderTop: 'none',
        width: '50%'
      },
      '& img': {
        ...sizeSmall
      }
    },
    [breakoutUp]: {
      '& img': {
        ...sizeMedium
      },
    },
  }),
  colOdd: css({
    '& img': {
      ...sizeSmall
    },
    [mUp]: {
      '& .tile': {
        width: '50%',
        borderTop: 'none',
      },
      '& .tile:nth-child(2n+2)': {
        borderLeft: `1px solid ${colors.divider}`,
      },
      '& img': {
        ...sizeSmall
      },
    },
    [breakoutUp]: {
      '& img': {
        ...sizeSmall
      },
      '& .tile': {
        width: '33.3%',
        borderLeft: `1px solid ${colors.divider}`,
      },
      '& .tile:nth-child(3n+1)': {
        borderLeft: 'none',
      },
    },
  })
}

export const TeaserFrontTileRow = ({
  children,
  attributes,
  mobileReverse
}) => {
  const kidsCountEven = React.Children.count(children) % 2 === 0
  return (
    <div
      role="group"
      {...attributes}
      {...tileRowStyles.row}
      {...(mobileReverse && tileRowStyles.rowReverse)}
      {...tileRowStyles[`col${kidsCountEven ? 'Even' : 'Odd'}`]}
    >
      {children}
    </div>
  )
}

TeaserFrontTileRow.propTypes = {
  children: PropTypes.node.isRequired,
  attributes: PropTypes.object,
}

TeaserFrontTileRow.defaultProps = {
  columns: 1
}

// Tile

const tileStyles = {
  container: css({
    margin: '0 auto',
    textAlign: 'center',
    padding: '30px 15px 40px 15px',
    width: '100%',
    [mUp]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 0'
    }
  }),
  textContainer: css({
    padding: 0,
    [mUp]: {
      padding: '0 13%',
      width: '100%'
    }
  }),
  imageContainer: css({
    margin: '0 auto 30px auto',
    [mUp]: {
      margin: '0 auto 60px auto',
      fontSize: 0, // Removes the small flexbox space.
    },
  }),
  image: css({
    minWidth: '100px',
    ...sizeTiny,
    [mUp]: {
      ...sizeSmall
    },
    [breakoutUp]: {
      ...sizeMedium
    }
  }),
}

const Tile = ({
  children,
  attributes,
  image,
  byline,
  alt,
  onClick,
  color,
  bgColor,
  align,
  aboveTheFold,
}) => {
  const background = bgColor || ''
  const justifyContent =
    align === 'top' ? 'flex-start' : align === 'bottom' ? 'flex-end' : ''
  const imageProps = image && FigureImage.utils.getResizedSrcs(
    image,
    IMAGE_SIZE.large,
    false
  )
  let tileContainerStyle = {
    background,
    cursor: onClick ? 'pointer' : 'default',
    justifyContent,
  }

  return (
    <div
      {...attributes}
      {...tileStyles.container}
      onClick={onClick}
      style={tileContainerStyle}
      className='tile'
    >
      {imageProps && (
        <div {...tileStyles.imageContainer}>
          <LazyLoad visible={aboveTheFold} style={{position: 'relative', fontSize: 0}}>
            <img src={imageProps.src} srcSet={imageProps.srcSet} alt={alt}
              {...tileStyles.image} />
            {byline && <FigureByline position='rightCompact' style={{color}}>{byline}</FigureByline>}
          </LazyLoad>
        </div>
      )}
      <div {...tileStyles.textContainer}>
        <Text color={color} maxWidth={'600px'} margin={'0 auto'}>
          {children}
        </Text>
      </div>
    </div>
  )
}

Tile.propTypes = {
  children: PropTypes.node.isRequired,
  attributes: PropTypes.object,
  image: PropTypes.string,
  byline: PropTypes.string,
  alt: PropTypes.string,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  align: PropTypes.oneOf([
    'top',
    'middle',
    'bottom'
  ]),
  aboveTheFold: PropTypes.bool,
}

Tile.defaultProps = {
  alt: ''
}

export default Tile
