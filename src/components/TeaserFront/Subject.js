import React from 'react'
import PropTypes from 'prop-types'
import { Editorial } from '../Typography'
import { css } from 'glamor'
import { lab } from 'd3-color'
import { tUp } from './mediaQueries'

const Subject = ({ children, color, compactColor, columns }) => {
  const labColor = lab(color)
  const labCompactColor = lab(compactColor || color)

  const style = css({
    color: labCompactColor.l > 50 ? labCompactColor.darker(0.6) : labCompactColor.brighter(3.0),
    display: 'inline',
    marginRight: !!children.length ? '.5em' : 0,
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

export default Subject
