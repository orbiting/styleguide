import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import Close from 'react-icons/lib/md/close'
import ChevronLeft from 'react-icons/lib/md/chevron-left'
import ChevronRight from 'react-icons/lib/md/chevron-right'

const styles = {
    //Gallery
    gallery: css({
        color: 'white',
        background: 'black',
        height: '100vh'
    }),
    //Header
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
    //Item
    mediaItem: css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        flex: 1,
        flexGrow: 1,
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
    buttonLeft: css({
        position: 'absolute',
        top: '45%',
        left: 0,
    }),
    buttonRight: css({
        position: 'absolute',
        top: '45%',
        right: 0,
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
            index: 0,
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
        const { mediaItem, captionItem, aspectRatio } = this.props.items[index]
        const total = this.props.items.length
        return (
            <div {...styles.gallery}>
                <Header index={index + 1} total={total} />
                <Item mediaItem={mediaItem} aspectRatio={aspectRatio} captionItem={captionItem} handleClickLeft={this.handleClickLeft} handleClickRight={this.handleClickRight} />
            </div>
        )
    }
}



const Header = ({ index, total }) => (
    <div {...styles.header}>
        <div {...styles.counter}>
            <span>{index}/{total}</span>
        </div>
        <div {...styles.close}><Close size={24} /></div>
    </div>
)

const Item = ({
    mediaItem,
    captionItem,
    aspectRatio,
    handleClickLeft,
    handleClickRight
}) => (
        <div {...styles.item}>

            <div {...styles.mediaItem}>{mediaItem}</div>
            <div>
                <button {...styles.buttonLeft} onClick={handleClickLeft}><ChevronLeft size={48} /></button>
                <button {...styles.buttonRight} onClick={handleClickRight}><ChevronRight size={48} /></button>
            </div>

            <div {...styles.caption}>{captionItem}</div>
        </div>
    )

Gallery.propTypes = {
    items: PropTypes.array.isRequired,
}

export default Gallery
