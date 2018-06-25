import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import zIndex from '../../theme/zIndex'
import { lBreakPoint, mBreakPoint, onlyS, lUp } from '../../theme/mediaQueries'
import debounce from "lodash.debounce";


import Swipeable from 'react-swipeable'
import Close from 'react-icons/lib/md/close'
import ChevronLeft from 'react-icons/lib/md/chevron-left'
import ChevronRight from 'react-icons/lib/md/chevron-right'

const mediaItemFadeInDurationMs = 700
const mediaItemFadeIn = css.keyframes({
  '0%': {opacity: 0,},
  '30%': {opacity: 1},
  '40%': {opacity: 1, right: 0},
  '50%': {opacity: 1, right: 30},
  '90%': {opacity: 1, right: 30},
  '100%': {opacity: 1, right: 0}
})

const swipeAnimationDurationMs = 200
const swipeAnimation = (side = 'top') => css.keyframes({
  '0%': {opacity: 1, [side]: 0},
  '100%': {opacity: 0, [side]: 60}
})

const styles = {
  gallery: css({
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    color: '#fff',
    background: '#000',
    display: 'flex',
    flexDirection: 'column'
  }),
  header: css({
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    padding: '30px 70px',
      [onlyS]: {
        padding: 15,    
      }
    }),
  body: css({
    display: 'flex',
    flex: '1 1 auto',
  }),
  counter: css({
    flex: 1,
  }),
  close: css({
    position: 'absolute',
    flex: 1,
    right: 68,
    top: 28,
    [onlyS]: {
      right: 13,
      top: 13,
    }
  }),
  closing: css({
    animation: `${swipeAnimation('top')} ${swipeAnimationDurationMs}ms ease-out`,
  }),
  exitLeft: css({
    animation: `${swipeAnimation('right')} ${swipeAnimationDurationMs}ms ease-out`,
  }),
  exitRight: css({
    animation: `${swipeAnimation('left')} ${swipeAnimationDurationMs}ms ease-out`,
  }),
  mediaItem: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    flex: 1,
    flexGrow: 1,
    opacity: 1,
    '& > *': {
      flex: '0 0 auto',
      verticalAlign: 'bottom',
      position: 'absolute', // make the image absolute
      left: 0, // and position it in the center
      right: 0,
      top: 0,
      bottom: 0,
      maxWidth: '100%',
      maxHeight: '100%',
      margin: 'auto',
    }
  }),
  mediaItemHint: css({
    animation: `${mediaItemFadeIn} ${mediaItemFadeInDurationMs}ms ease-out`,
    [lUp]: {
      animation: 'none',
    },
  }),
  nav: css({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    color: '#fff',
    zIndex: zIndex.overlay,
    '& .left': {
      justifyContent: 'flex-start',
    },
    '& .right': {
      justifyContent: 'flex-end'
    }
  }),
  navClose: css({
    position: 'fixed', 
    width: 80, 
    height: 80, 
    top: 8, 
    right: 8
  }),
  navArea: css({
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    height: '100vh',
    padding: '0 30px',
    opacity: 0,
    transition: 'opacity 0.1s linear',
    ':hover': {
      transition: 'opacity 0.5s linear',
      opacity: '0.7'
    }
  }),
  navButton: css({
    color: '#fff',
    display: 'none',
    [lUp]: {
      display: 'block',
    }
  }),
  media: css({
    height: '100px',
  }),
  caption: css({
    flex: '0 0 auto',
    padding: '15px 70px',
    [onlyS]: {
      padding: 15
    }
  })
}

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: +props.startItem || 0,
      hasSwiped: false
    }

    this.handleClickLeft = () => {
      const total = this.props.items.length
      this.setState(prevState => ({
        index: prevState.index !== 0 ? (prevState.index - 1) : (total - 1),
        exitLeft: false
      }))
    }

    this.handleClickRight = () => {
      const total = this.props.items.length - 1
      this.setState(prevState => ({
        index: prevState.index !== total ? (prevState.index + 1) : 0,
        exitRight: false
      }))
    }

    this.handleSwipeLeft = () => this.setState({exitLeft: true, hasSwiped: true}, debounce(this.handleClickLeft, swipeAnimationDurationMs * 0.7))
    this.handleSwipeRight = () => this.setState({exitRight: true, hasSwiped: true}, debounce(this.handleClickRight, swipeAnimationDurationMs * 0.7))

  }

  render() {
    const { index, hasSwiped } = this.state
    const { onClose, items } = this.props
    const { mediaItem, captionItem } = items[index]
    const total = this.props.items.length
    const w = window.innerWidth / 2
    return (
      <Swipeable 
        // onSwipedLeft={this.handleClickLeft} 
        // onSwipedRight={this.handleClickRight} 
        onSwipedDown={() => this.setState({closing: true}, debounce(onClose, swipeAnimationDurationMs))}
        onSwipedLeft={this.handleSwipeLeft}
        onSwipedRight={this.handleSwipeRight}
        onTap={() => {}}
        delta={10}
        preventDefaultTouchmoveEvent={true}
        stopPropagation={true}
      >
        <NavOverlay
          handleClickLeft={this.handleClickLeft} 
          handleClickRight={this.handleClickRight}
          onClose={onClose}          
        />
        <div {...styles.gallery}>
          <div {...styles.header}>
            <div {...styles.counter}>
              <span>{index+1}/{total}</span>
            </div>
            <div {...styles.close} onClick={onClose}><Close size={24} /></div>
          </div>
          {/* <div style={{ position: 'absolute', width:'100%', height: '100%', left: -this.state.swipePos}}> */}
            <div {...styles.body}>
              <div {...merge(
                styles.mediaItem, 
                !hasSwiped && items.length > 1 && styles.mediaItemHint,
                this.state.exitLeft && styles.exitLeft, 
                this.state.exitRight && styles.exitRight, 
                this.state.closing && styles.closing)}>
                {mediaItem}
              </div>
            </div>
          {/* </div> */}
          <div {...styles.caption}>
            {captionItem}
          </div>
        </div>
      </Swipeable>
    )
  }
}

const NavOverlay = ({ handleClickLeft, handleClickRight, onClose }) => 
  <div {...styles.nav}>
    <div {...styles.navArea} className='left' onClick={handleClickLeft}>
      <div {...styles.navButton}>
        <ChevronLeft size={48} />
      </div>
    </div>
    <div {...styles.navArea} className='right' onClick={handleClickRight}>
      <div {...styles.navButton}>
        <ChevronRight size={48} />
      </div>
    </div>
    <div {...styles.navClose} onClick={onClose} />
  </div>


Gallery.propTypes = {
  items: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Gallery
