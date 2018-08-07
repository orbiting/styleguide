import React from 'react'
import PropTypes from 'prop-types'
import { Editorial } from '../Typography'
import { css } from 'glamor'

const Subject = ({ children, color }) => {
  const style = css({
    color,
    display: 'inline',
    minWidth: '100px'
  })
  return <Editorial.Subject {...style}>{children}</Editorial.Subject>
}

Subject.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string
}

Subject.defaultProps = {
  color: '#8c8c8c'
}

export default Subject
