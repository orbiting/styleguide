import React from 'react'
import PropTypes from 'prop-types'
import { Editorial } from '../Typography'
import { css } from 'glamor'

const Subject = ({ children, color, columns }) => {
  const style = css({
    color,
    display: 'inline',
    minWidth: '100px'
  })
  return (
    <Editorial.Subject {...style} small={columns === 3}>
      {children}
    </Editorial.Subject>
  )
}

Subject.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  columns: PropTypes.number
}

Subject.defaultProps = {
  color: '#8c8c8c'
}

export default Subject
