import React from 'react'
import PropTypes from 'prop-types'
import {css} from 'glamor'

import colors from '../../theme/colors'
import {sansSerifRegular14} from '../Typography/styles'
import {profilePictureSize, profilePictureMargin} from '../Comment/CommentHeader'

const styles = {
  root: css({
    position: 'relative',
    height: 0,
    borderTop: `2px solid ${colors.primary}`,
    marginTop: '-2px'
  }),
  button: css({
    outline: 'none',
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(100%, -60%)',
    display: 'block',
    WebkitAppearance: 'none',
    background: 'white',
    border: 'none',
    padding: '4px 0 4px 10px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',

    ...sansSerifRegular14,
    color: colors.primary,
    lineHeight: 1,
  })
}

const width = (visualDepth) =>
  visualDepth * (profilePictureSize + profilePictureMargin) - profilePictureMargin

const Collapse = ({t, visualDepth, onClick}) => (
  <div {...styles.root} style={{width: width(visualDepth)}}>
    <button {...styles.button} onClick={onClick}>
      {t('styleguide/CommentTreeCollapse/label')}
    </button>
  </div>
)

Collapse.propTypes = {
  t: PropTypes.func.isRequired,
  visualDepth: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Collapse
