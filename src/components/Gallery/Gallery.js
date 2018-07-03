import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import zIndex from '../../theme/zIndex'
import { onlyS, lUp, mUp } from '../../theme/mediaQueries'
import debounce from "lodash.debounce";
import Spinner from "../Spinner";

import Swipeable from 'react-swipeable'
import Close from 'react-icons/lib/md/close'
import ChevronLeft from 'react-icons/lib/md/chevron-left'
import ChevronRight from 'react-icons/lib/md/chevron-right'
import { FigureImage, FigureCaption, FigureByline } from "../Figure"

const mediaItemFadeInDurationMs = 700
const mediaItemFadeIn = css.keyframes({
  '0%': {opacity: 0,},
  '30%': {opacity: 1},
  '40%': {opacity: 1, right: 0},
  '50%': {opacity: 1, right: 25},
  '90%': {opacity: 1, right: 25},
  '100%': {opacity: 1, right: 0}
})

const swipeAnimationDurationMs = 200
const swipeAnimation = (side = 'top') => {
  const kfrms = css.keyframes({
    '0%': {opacity: 1, [side]: 0},
    '100%': {opacity: 0, [side]: 60}
  })
  return `${kfrms} ${swipeAnimationDurationMs}ms ease-out`
}

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
    transition: 'opacity 0.1s ease-in',
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
  media: css({
    height: '100px',
  }),
  caption: css({
    flex: '0 0 auto',
    padding: '15px 70px',
    transition: 'opacity 0.1s ease-in',
    [onlyS]: {
      padding: 15,
    }
  }),
  mediaItem: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    flex: 1,
    flexGrow: 1,
    opacity: 1
  }),
  mediaItemImage: css({
    flex: '0 0 auto',
    verticalAlign: 'bottom',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto',
  }),
  mediaItemSwipeHint: css({
    animation: `${mediaItemFadeIn} ${mediaItemFadeInDurationMs}ms ease-out`,
    [mUp]: {
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
    justifyContent: 'space-between',
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
  closing: css({
    animation: swipeAnimation('top'),
  }),
  exitLeft: css({
    animation: swipeAnimation('right'),
  }),
  exitRight: css({
    animation: swipeAnimation('left'),
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
    width: '33.333%',
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
}

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: +props.startItem || 0,
      hasSwiped: false,
      focus: false,
    }

    this.handleClickLeft = () => {
      const total = this.props.items.length
      this.setState(prevState => ({
        index: prevState.index !== 0 ? (prevState.index - 1) : (total - 1),
        exitLeft: false,
        exitRight: false,
      }))
    }

    this.handleClickRight = () => {
      const total = this.props.items.length - 1
      this.setState(prevState => ({
        index: prevState.index !== total ? (prevState.index + 1) : 0,
        exitLeft: false,
        exitRight: false,
      }))
    }

    this.toggleFocus = () => {
      this.setState(prevState => ({ focus: !prevState.focus }))
    }

    this.handleSwipeDown = () => 
      this.setState(
        {closing: true}, 
        debounce(props.onClose, swipeAnimationDurationMs)
      )

    this.handleSwipeLeft = () => 
      this.setState(
        {exitLeft: true, hasSwiped: true}, 
        debounce(this.handleClickRight, swipeAnimationDurationMs * 0.7)
      )

    this.handleSwipeRight = () => 
      this.setState(
        {exitRight: true, hasSwiped: true}, 
        debounce(this.handleClickLeft, swipeAnimationDurationMs * 0.7)
      )

  }

  render() {
    const { index, hasSwiped, exitLeft, exitRight, closing, focus } = this.state
    const { onClose, items } = this.props
    const { src, caption, credit } = items[index]
    const total = this.props.items.length
    const srcs = FigureImage.utils.getResizedSrcs(src, window.innerWidth)
    return (
      <Swipeable 
        onSwipedDown={this.handleSwipeDown}
        onSwipedLeft={this.handleSwipeLeft}
        onSwipedRight={this.handleSwipeRight}
        delta={10}
        preventDefaultTouchmoveEvent={true}
        stopPropagation={true}
      >
        <NavOverlay
          handleClickLeft={this.handleClickLeft} 
          handleClickRight={this.handleClickRight}
          handleClick={this.toggleFocus}
          onClose={onClose}      
        />
        <div {...styles.gallery}>
          <div {...styles.header} style={{ opacity: focus ? 0 : 1 }}>
            <div {...styles.counter}>
              <span>{index+1}/{total}</span>
            </div>
            <div {...styles.close} onClick={onClose}>
              <Close size={24} />
            </div>
          </div>
          <div {...styles.body}>
            <div {...merge(
              styles.mediaItem, 
              !hasSwiped && items.length > 1 && styles.mediaItemSwipeHint,
              exitLeft && styles.exitLeft, 
              exitRight && styles.exitRight, 
              closing && styles.closing)}
            >
              <Spinner />
              <img key={src} {...styles.mediaItemImage} {...srcs} />
            </div>
          </div>
          <div {...styles.caption} style={{ opacity: focus ? 0 : 1 }}>
            <FigureCaption>
              { caption }
              { credit && <FigureByline>{ credit }</FigureByline> }
            </FigureCaption>
          </div>
        </div>
      </Swipeable>
    )
  }
}

Gallery.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired,
    caption: PropTypes.string,
    credit: PropTypes.string
  })),
  onClose: PropTypes.func.isRequired
}

class NavOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.ref = null
    this.setRef = ref => this.ref = ref
    const { handleClickLeft, handleClickRight, onClose } = props
    this.handleKeyUp = (event) => {
      switch (event.keyCode) {
        case 37:
          handleClickLeft()
          break;
        case 39:
          handleClickRight()
          break;
        case 27:
          onClose()
          break;
        default:
          break;
      }
    }
  }
  componentDidMount() {
    this.ref && this.ref.focus()
  }
  render() {
    const { handleClickLeft, handleClickRight, onClose, handleClick } = this.props
    return (
      <div
        ref={this.setRef}
        {...styles.nav}
        onKeyDown={e => this.handleKeyUp(e, handleClickLeft, handleClickRight, onClose)}
        tabIndex={-1}
      >
        <div {...styles.navArea} className='left' onClick={handleClickLeft}>
          <div {...styles.navButton}>
            <ChevronLeft size={48} />
          </div>
        </div>
        <div {...styles.navArea} onClick={handleClick}></div>
        <div {...styles.navArea} className='right' onClick={handleClickRight}>
          <div {...styles.navButton}>
            <ChevronRight size={48} />
          </div>
        </div>
        <div {...styles.navClose} onClick={onClose} />
      </div>  
    )
  }
}

export default Gallery
