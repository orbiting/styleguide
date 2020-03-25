import React from 'react'
import { merge, css } from 'glamor'
import { mUp } from '../../theme/mediaQueries'
import colors from '../../theme/colors'

const slideUp = css.keyframes({
  from: {
    bottom: -400
  },
  to: {
    bottom: 0
  }
})

const styles = {
  calloutContainer: css({
    position: 'fixed',
    top: 45,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 12,
    background: 'rgba(0,0,0,0.5)',
    [mUp]: {
      position: 'absolute',
      top: 0,
      left: 'auto',
      bottom: 'auto',
      right: 0,
      background: 'none'
    }
  }),
  arrow: css({
    transform: 'rotate(-45deg)',
    background: colors.containerBg,
    borderTop: `1px solid ${colors.divider}`,
    borderRight: `1px solid ${colors.divider}`,
    width: 12,
    height: 12,
    position: 'absolute',
    top: -7,
    right: 15,
    display: 'none',
    [mUp]: {
      display: 'block'
    }
  }),
  arrowLeft: css({
    left: 31,
    right: 'auto'
  }),
  callout: css({
    zIndex: 1,
    position: 'absolute',
    //background: 'white',
    border: `1px solid ${colors.divider}`,
    left: 0,
    bottom: -400,
    right: 0,
    padding: 15,
    background: 'red',
    animation: `0.3s ${slideUp} 0.2s forwards`,
    textAlign: 'left',
    [mUp]: {
      right: -10,
      left: 'auto',
      bottom: 'auto',
      top: 40,
      padding: '10px 30px 10px 10px',
      animation: 'none'
    }
  }),
  calloutLeft: css({
    [mUp]: {
      left: -50,
      right: 'auto'
    }
  })
}

const Callout = ({ children, leftAligned, onClose }) => (
  <div {...styles.calloutContainer} onClick={onClose}>
    <div
      {...merge(styles.callout, leftAligned && styles.calloutLeft)}
      onClick={e => e.stopPropagation()}
    >
      <div {...merge(styles.arrow, leftAligned && styles.arrowLeft)} />
      {children}
    </div>
  </div>
)

export default Callout
