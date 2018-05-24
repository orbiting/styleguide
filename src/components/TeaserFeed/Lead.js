import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import colors from '../../theme/colors'
import { mUp } from '../../theme/mediaQueries'
import {
  serifRegular16,
  serifRegular19,
  serifBold16,
  serifBold19
} from '../Typography/styles'

const styles = {
  main: css({
    ...serifRegular16,
    margin: '0 0 5px 0',
    '& em': {
      ...serifBold16,
      fontStyle: 'normal'
    },
    [mUp]: {
      ...serifRegular19,
      '& em': {
        ...serifBold19
      }
    },
    color: colors.text
  })
}

const Lead = ({ children }) => {
  return <p {...styles.main}>{children}</p>
}

Lead.propTypes = {
  children: PropTypes.node.isRequired
}

export default Lead
