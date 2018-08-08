import React from 'react'
import PropTypes from 'prop-types'
import { Editorial } from '../Typography'

const Lead = ({ children, columns }) => (
  <Editorial.Lead small={columns === 3} style={{color: 'inherit', display: 'inline'}}>
    {children}
  </Editorial.Lead>
)

Lead.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.number
}

export default Lead
