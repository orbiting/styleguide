import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { mBreakPoint, mUp } from '../../theme/mediaQueries'
import { CONTENT_PADDING } from '../Grid'
import { IMAGE_SIZE } from '../InfoBox/InfoBox'

const styles = {
  flex: css({
    [mUp]: {
      display: 'flex'
    }
  })
}

const SIZE = {
  narrow: 495
}

class PullQuote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMobile: false
    }

    this.onResize = () => {
      if (this.ref) {
        const isMobile = window.innerWidth < mBreakPoint
        if (!isMobile) {
          this.ref.style.marginLeft = `-${Math.min(
            IMAGE_SIZE['S'] + CONTENT_PADDING,
            this.x - CONTENT_PADDING
          )}px`
        } else {
          this.ref.style.marginLeft = 0
        }
      }
    }
    this.ref = ref => {
      this.ref = ref
    }
    this.measure = () => {
      if (this.ref) {
        const rect = this.ref.getBoundingClientRect()
        const leftMargin = parseInt(this.ref.style.marginLeft || 0)
        this.x = window.pageXOffset + rect.left - leftMargin
      }
      this.onResize()
    }
  }

  componentDidMount() {
    if (this.props.breakout) {
      window.addEventListener('resize', this.measure)
      this.measure()
    }
  }
  componentDidUpdate() {
    if (this.props.breakout) {
      this.measure()
    }
  }
  componentWillUnmount() {
    if (this.props.breakout) {
      window.removeEventListener('resize', this.measure)
    }
  }

  render() {
    const { children, attributes, textAlign, size } = this.props
    const margin = textAlign === 'center' ? '0 auto' : 0
    const maxWidth = (size && `${SIZE[size]}px`) || ''

    const hasFigure = [...children].some(
      c => c.props.typeName === 'PullQuoteFigure'
    )

    return (
      <blockquote
        ref={this.ref}
        {...attributes}
        {...(hasFigure ? styles.flex : {})}
        style={{ textAlign, maxWidth, margin }}
      >
        {children}
      </blockquote>
    )
  }
}

PullQuote.propTypes = {
  children: PropTypes.node.isRequired,
  attributes: PropTypes.object,
  textAlign: PropTypes.oneOf(['inherit', 'left', 'center', 'right']),
  size: PropTypes.oneOf(['narrow']),
  breakout: PropTypes.bool
}

PullQuote.defaultProps = {
  textAlign: 'inherit',
  breakout: false
}

export default PullQuote
