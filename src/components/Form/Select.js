// Forked from `react-accessible-dropdown`.
// WORK IN PROGRESS

// TODO: Add MIT license to repo
// TODO: Figure out why keydown listeners don't work

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { css, merge } from 'glamor'
import PropTypes from 'prop-types'
import * as colors from '../../theme/colors'
import { fontFamilies } from '../../theme/fonts'
import {
  borderWidth,
  fieldHeight,
  xPadding,
  yPadding,
  lineHeight,
  labelTextStyle,
  labelTextTopStyle
} from './Field'

const selectLabelTextStyle = merge(
  labelTextStyle,
  css({
    color: colors.disabled,
    pointerEvents: 'none',
    zIndex: 1
  })
)
const selectLabelTextTopStyle = merge(
  labelTextTopStyle,
  css({
    color: colors.primary
  })
)

const styles = {
  root: css({
    fontSize: 22,
    padding: `${lineHeight}px 0 0`,
    position: 'relative'
  }),
  control: css({
    position: 'relative',
    overflow: 'hidden',
    outline: 'none',
    verticalAlign: 'bottom',
    padding: `0 ${xPadding}px`,
    textDecoration: 'none',
    height: fieldHeight,
    lineHeight: `${fieldHeight}px`,
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: 22,
    boxSizing: 'border-box',
    backgroundColor: 'white',
    border: 'none',
    borderBottom: `solid ${colors.disabled} ${borderWidth}px`,
    borderRadius: 0,
    color: colors.text,
    ':focus': {
      borderColor: colors.primary
    }
  }),
  groupTitle: css({
    padding: '8px 0 2px',
    color: colors.disabled
  }),
  menu: css({
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    overflowY: 'auto',
    position: 'absolute',
    top: '100%',
    width: '100%',
    zIndex: 1000,
    overflowScrolling: 'touch'
  }),
  option: css({
    borderBottom: `solid ${colors.disabled} ${borderWidth}px`,
    boxSizing: 'border-box',
    color: colors.text,
    cursor: 'pointer',
    display: 'block',
    padding: '6px 0',
    ':hover': {
      backgroundColor: colors.secondaryBg
    },
    ':focus': {
      backgroundColor: colors.secondaryBg,
      outline: 'none'
    }
  }),
  optionSelected: css({
    backgroundColor: colors.primaryBg,
    ':hover': {
      backgroundColor: colors.primaryBg
    },
    ':focus': {
      backgroundColor: colors.primaryBg,
      outline: 'none'
    }
  }),
  noResults: css({
    boxSizing: 'border-box',
    cursor: 'default',
    display: 'block'
  })
}
const arrowStyle = css({
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: lineHeight + fieldHeight / 2 - 10,
  cursor: 'pointer',
  zIndex: 1
})

// TODO: Reuse Arrows from Field (after making style a property)
const ArrowUp = ({ size, fill, ...props }) =>
  <svg
    {...props}
    fill={fill}
    {...arrowStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
const ArrowDown = ({ size, fill, ...props }) =>
  <svg
    {...props}
    fill={fill}
    {...arrowStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>

class Select extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: props.value || {
        label: '',
        value: ''
      },
      isOpen: false
    }
    this.dropdownButton = null
    this.dropdownMenu = null
    this.mounted = true
    this.handleDocumentClick = this.handleDocumentClick.bind(this)
    this.handleKeyPressEvent = this.handleKeyPressEvent.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.value !== this.state.selected) {
      this.setState({ selected: newProps.value })
    } else if (!newProps.value && newProps.placeholder) {
      this.setState({ selected: { label: newProps.placeholder, value: '' } })
    } else if (!newProps.value) {
      this.setState({
        selected: { label: '', value: '' }
      })
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false)
    document.addEventListener('touchend', this.handleDocumentClick, false)
    document.addEventListener('keydown', this.handleKeyPressEvent, false)
  }

  componentWillUnmount() {
    this.mounted = false
    document.removeEventListener('click', this.handleDocumentClick, false)
    document.removeEventListener('touchend', this.handleDocumentClick, false)
    document.removeEventListener('keydown', this.handleKeyPressEvent, false)
  }

  handleDocumentClick(event) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        this.setState({ isOpen: false })
      }
    }
  }

  handleKeyPressEvent(e) {
    if (e.keyCode === 27) {
      this.setState({ isOpen: false })
    }
  }

  fireChangeEvent(newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected)
    }
  }

  handleMouseDown(event) {
    if (event.type === 'mousedown' && event.button !== 0) return
    event.stopPropagation()
    event.preventDefault()

    if (!this.props.disabled) {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }
  }

  handleDropdownFocus() {
    this.setState({ isOpen: true })
  }

  handleDropdownBlur(e) {
    let stayOpen = false
    if (e.relatedTarget === this.dropdownButton) {
      stayOpen = true
    } else if (this.dropdownMenu) {
      const options = this.dropdownMenu.getElementsByClassName(
        `${this.props.baseClassName}-option`
      )
      for (var i = 0; i < options.length; i++) {
        if (e.relatedTarget === options[i]) {
          stayOpen = true
        }
      }
    }
    this.setState({ isOpen: stayOpen })
  }

  handleDropdownKeyDown(e) {
    if (e.keyCode === 40) {
      e.preventDefault()
      const options = this.dropdownMenu.getElementsByClassName(
        `${this.props.baseClassName}-option`
      )
      options.length && options[0].focus()
    }
  }

  handleOptionKeyDown(e, value, label) {
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault()
      this.setValue(value, label)
    } else if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault()
      const options = this.dropdownMenu.getElementsByClassName(
        `${this.props.baseClassName}-option`
      )
      for (var i = 0; i < options.length; i++) {
        if (options[i] === e.target) {
          e.keyCode === 38 && i > 0 && options[i - 1].focus()
          e.keyCode === 40 && i < options.length - 1 && options[i + 1].focus()
        }
      }
    }
  }

  setValue(value, label) {
    let newState = {
      selected: {
        value,
        label
      },
      isOpen: false
    }
    this.fireChangeEvent(newState)
    this.dropdownButton.focus()
    this.setState(newState)
  }

  renderOption(option) {
    let value = option.value || option.label || option
    let label = option.label || option.value || option
    let optionStyles =
      option.value === this.state.selected.value
        ? merge(styles.option, styles.optionSelected)
        : styles.option
    return (
      <div
        {...optionStyles}
        role="option"
        tabIndex={this.props.tabIndex || '0'}
        className={`${this.props.baseClassName}-option`}
        key={value}
        onMouseDown={() => this.setValue(value, label)}
        onClick={() => this.setValue(value, label)}
        onKeyDown={e => this.handleOptionKeyDown(e, value, label)}
        onBlur={e => this.handleDropdownBlur(e)}
      >
        {label}
      </div>
    )
  }

  buildMenu() {
    let { options, baseClassName } = this.props
    let ops = options.map(option => {
      if (option.type === 'group') {
        let _options = option.items.map(item => this.renderOption(item))
        return (
          <div className={`${baseClassName}-group`} key={option.name}>
            <div {...styles.groupTitle}>
              {option.name}
            </div>
            {_options}
          </div>
        )
      } else {
        return this.renderOption(option)
      }
    })

    return ops.length ? ops : <div {...styles.noResults}>No options found</div>
  }

  render() {
    const { baseClassName, label } = this.props
    const selectedValue =
      typeof this.state.selected === 'string'
        ? this.state.selected
        : this.state.selected.label

    let menu = this.state.isOpen
      ? <div
          ref={el => {
            this.dropdownMenu = el
          }}
          {...styles.menu}
        >
          {this.buildMenu()}
        </div>
      : null

    let arrow = this.state.isOpen
      ? <ArrowUp fill={colors.text} size={fieldHeight / 2} />
      : <ArrowDown fill={colors.text} size={fieldHeight / 2} />
    const labelStyle = !!this.state.selected.value
      ? merge(selectLabelTextStyle, selectLabelTextTopStyle)
      : merge(selectLabelTextStyle)

    return (
      <div {...styles.root}>
        <label {...labelStyle}>
          {label}
        </label>
        {arrow}
        <div
          {...styles.control}
          tabIndex={this.props.tabIndex || '0'}
          role="listbox"
          ref={el => {
            this.dropdownButton = el
          }}
          onFocus={() => this.handleDropdownFocus()}
          onBlur={e => this.handleDropdownBlur(e)}
          onMouseDown={e => this.handleMouseDown(e)}
          onTouchEnd={e => this.handleMouseDown(e)}
          onKeyDown={e => this.handleDropdownKeyDown(e)}
        >
          {selectedValue}
        </div>
        {menu}
      </div>
    )
  }
}

// TODO: Get rid of baseClassName
Select.defaultProps = { baseClassName: 'Select' }

export default Select
