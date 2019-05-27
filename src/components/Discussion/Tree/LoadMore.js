import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import colors from '../../../theme/colors'
import { sansSerifRegular14 } from '../../Typography/styles'
import { usePrevious } from '../../../lib/usePrevious'

const styles = {
  root: css({
    ...sansSerifRegular14,
    color: colors.primary,
    position: 'relative',
    outline: 'none',
    display: 'block',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    lineHeight: '40px',
    padding: 0,
    '&:hover': {
      color: colors.secondary
    }
  }),
  alternative: css({
    color: 'white',
    padding: '0 7px',
    '&:hover': {
      color: 'white'
    },
    '&::before': {
      position: 'absolute',
      content: '""',
      display: 'block',
      top: 10,
      left: 0,
      right: 0,
      bottom: 9,
      borderRadius: 10,
      background: colors.primary
    },
    '&:hover::before': {
      background: colors.secondary
    },
    '& > span': {
      position: 'relative'
    }
  })
}

export const LoadMore = ({ t, count, onClick }) => {
  const previousCount = usePrevious(count)
  return <LoadMore1 t={t} alternative={previousCount !== undefined && count !== previousCount} count={count} onClick={onClick} />
}

LoadMore.propTypes = {
  t: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}

/**
 * This component is exported only so that we can document it in the styleguide.
 */
export const LoadMore1 = ({ t, alternative, count, onClick }) => (
  <button {...styles.root} {...alternative && styles.alternative} onClick={onClick}>
    <span>{t.pluralize('styleguide/CommentTreeLoadMore/label', { count })}</span>
  </button>
)
