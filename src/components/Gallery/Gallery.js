import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import zIndex from '../../theme/zIndex'

import Swipeable from 'react-swipeable'
import Close from 'react-icons/lib/md/close'
import ChevronLeft from 'react-icons/lib/md/chevron-left'
import ChevronRight from 'react-icons/lib/md/chevron-right'

const mediaItemFadeIn = css.keyframes({
  '0%': {opacity: 0},
  '100%': {opacity: 1}
})


const styles = {
  gallery: css({
    color: '#fff',
    background: '#000',
    width: '100%',
    height: '100vh'
  }),
  header: css({
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: '30px',
    padding: '10px',
  }),
  counter: css({
    flex: 1,
  }),
  close: css({
    position: 'absolute',
    flex: 1,
    right: 0,
    top: 0,
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
    animation: `${mediaItemFadeIn} 0.2s linear`,
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
  item: css({
    position: 'absolute',
    top: '30px',
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 30px)',
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
  navArea: css({
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    height: '100vh',
    padding: '0 50px',
    opacity: 0,
    transition: 'opacity 0.5s linear',
    ':hover': {
      transition: 'opacity 0.5s linear',
      opacity: '0.7'
    }
  }),
  navButton: css({
    color: '#fff',
  }),
  media: css({
    height: '100px',
  }),
  caption: css({
    padding: '10px',
  })
}

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: +props.startItem || 0,
      swipePos: 0
    }
    this.handleClickLeft = this.handleClickLeft.bind(this)
    this.handleClickRight = this.handleClickRight.bind(this)
  }

  handleClickLeft() {
    const total = this.props.items.length
    this.setState(prevState => ({
      index: prevState.index !== 0 ? (prevState.index - 1) : (total - 1),
    }))
  }

  handleClickRight() {
    const total = this.props.items.length - 1
    this.setState(prevState => ({
      index: prevState.index !== total ? (prevState.index + 1) : 0,
    }))
  }

  render() {
    const { index } = this.state
    const { onClose } = this.props
    const { mediaItem, captionItem, aspectRatio } = this.props.items[index]
    const total = this.props.items.length
    return (
      <Swipeable 
        // onSwipedLeft={this.handleClickLeft} 
        // onSwipedRight={this.handleClickRight} 
        onSwipedDown={onClose ? onClose : () => {}}
        onTap={() => {}}
        delta={10}
        preventDefaultTouchmoveEvent={true}
        stopPropagation={true}
        onSwiping={(e, deltaX, deltaY, absX, absY, velocity) => this.setState({swipePos: deltaX})}
        onSwiped={(e, deltaX, deltaY, isFlick, velocity) => isFlick && this.setState({swipePos: 0}, this.handleClickRight) || this.setState({swipePos: 0})}
      >
        <Nav
          handleClickLeft={this.handleClickLeft} 
          handleClickRight={this.handleClickRight}           
        />
        <div {...styles.gallery}>
          <Header 
            index={index + 1} 
            total={total} 
            onClose={onClose}
          />
          <div style={{ position: 'absolute', width:'100%', height: '100%', left: -this.state.swipePos}}>
            <div {...styles.item}>
              <div {...styles.mediaItem}>
                {mediaItem}
              </div>
              <div {...styles.caption}>{captionItem}</div>
            </div>
          </div>
        </div>
      </Swipeable>
    )
  }
}

const Header = ({ index, total, onClose }) => (
  <div {...styles.header}>
    <div {...styles.counter}>
      <span>{index}/{total}</span>
    </div>
    <div {...styles.close} onClick={onClose}><Close size={24} /></div>
  </div>
)

const Nav = ({ handleClickLeft, handleClickRight }) => 
  <div {...styles.nav}>
    <div {...styles.navArea} className='left' onClick={handleClickLeft}>
      <div {...styles.navButton}>
        <ChevronLeft size={64} />
      </div>
    </div>
    <div {...styles.navArea} className='right' onClick={handleClickRight}>
      <div {...styles.navButton}>
        <ChevronRight size={64} />
      </div>
    </div>
  </div>


const Item = ({
  mediaItem,
  captionItem,
  aspectRatio
}) => (
  <div {...styles.item}>
    <div {...styles.mediaItem}>
      {mediaItem}
    </div>
    <div {...styles.caption}>{captionItem}</div>
  </div>
)

Gallery.propTypes = {
  items: PropTypes.array.isRequired,
  onClose: PropTypes.func
}

export default Gallery
