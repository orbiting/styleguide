import React from 'react'
import PropTypes from 'prop-types'
import { Editorial } from '../Typography'
import { css } from 'glamor'
import { lab } from 'd3-color'
import { mUp, tUp } from './mediaQueries'

const Subject = ({ children, color, compactColor, columns }) => {
  const labColor = lab(color)
  const labCompactColor = lab(compactColor || color)
  console.log(color, lab(color))

  const style = css({
    color: labCompactColor.l > 50 ? labCompactColor.darker(1.0) : labCompactColor.brighter(3.0),
    display: 'inline',
    minWidth: '100px',
    [tUp]: {
      color: labColor.l > 50 ? labColor.darker(2.0) : labColor.brighter(3.0),
    }
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
  compactColor: PropTypes.string,
  columns: PropTypes.number
}

Subject.defaultProps = {
  //color: '#8c8c8c'
}

export default Subject
