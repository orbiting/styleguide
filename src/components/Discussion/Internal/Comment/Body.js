import React from 'react'
import { css } from 'glamor'

import { Collapsable } from '../../../Collapsable'
import { DiscussionContext } from '../../DiscussionContext'

import { Label } from '../../../Typography'
import { sansSerifRegular14 } from '../../../Typography/styles'

import colors from '../../../../theme/colors'
import { mUp } from '../../../../theme/mediaQueries'

import { Context } from './Context'
import { renderCommentMdast } from './render'

import { COLLAPSED_HEIGHT } from '../../config'

const highlightPadding = 7

const buttonStyle = {
  outline: 'none',
  WebkitAppearance: 'none',
  background: 'transparent',
  border: 'none',
  padding: '0',
  display: 'block',
  cursor: 'pointer',
  height: '100%'
}

const styles = {
  container: css({
    position: 'relative'
  }),
  highlight: css({
    top: -highlightPadding,
    left: -highlightPadding,
    right: -highlightPadding,
    bottom: -highlightPadding,
    padding: highlightPadding,
    width: `calc(100% + ${highlightPadding * 2}px)`,
    backgroundColor: colors.primaryBg
  }),
  margin: css({
    display: 'block',
    marginTop: 8
  }),
  unpublished: css({
    marginBottom: 8
  }),
  collapsedBody: css({
    height: `${COLLAPSED_HEIGHT.mobile}px`,
    overflow: 'hidden',
    [mUp]: {
      maxHeight: `${COLLAPSED_HEIGHT.desktop}px`
    }
  }),
  context: css({
    marginBottom: 10
  }),
  collapeToggleContainer: css({
    position: 'relative',
    borderTop: `1px solid ${colors.divider}`,
    '&::before': {
      position: 'absolute',
      display: 'block',
      content: '""',
      left: 0,
      right: 0,
      top: -61,
      height: 60,
      background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
    }
  }),
  collapseToggleButton: css({
    ...buttonStyle,
    ...sansSerifRegular14,
    color: colors.primary,
    height: '32px',
    lineHeight: '32px',
    '@media (hover)': {
      ':hover': {
        color: colors.secondary
      }
    }
  })
}

export const Body = ({ t, comment, context }) => {
  const { discussion, highlightedCommentId } = React.useContext(DiscussionContext)
  const { collapsable } = discussion
  const { published, content, userCanEdit, adminUnpublished } = comment

  const isHighlighted = highlightedCommentId === comment.id

  const body = (
    <>
      {content && context && context.title && (
        <div {...styles.context}>
          <Context {...context} />
        </div>
      )}
      {content && renderCommentMdast(content)}
    </>
   )
  const bodyNode = collapsable && !isHighlighted
    ? <Collapsable t={t} collapsable={collapsable && !isHighlighted} style={{ opacity: published ? 1 : 0.5 }}>
        {body}
      </Collapsable>
    : body

  return (
    <>
      {!published && <div {...styles.unpublished}>{t('styleguide/comment/unpublished')}</div>}
      {bodyNode}
      {userCanEdit &&
        (() => {
          if (adminUnpublished) {
            return <Label {...styles.margin}>{t('styleguide/comment/adminUnpublished')}</Label>
          } else if (!published) {
            return <Label {...styles.margin}>{t('styleguide/comment/unpublished/userCanEdit')}</Label>
          } else {
            return null
          }
        })()}
    </>
  )
}
