import React from 'react'
import { css } from 'glamor'
import scrollIntoView from 'scroll-into-view'

import colors from '../../../theme/colors'
import { DiscussionContext } from '../DiscussionContext'
import { CommentComposer } from '../Composer/CommentComposer'
import { LoadMore } from './LoadMore'
import * as Comment from '../Internal/Comment'
import * as config from '../config'
import { mUp } from '../../../theme/mediaQueries'

const buttonStyle = {
  display: 'block',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
  padding: 0
}

const styles = {
  highlightContainer: css({
    padding: '7px 7px 0 7px',
    margin: '0 -7px 12px -7px',
    background: colors.primaryBg
  }),
  root: ({ isExpanded, nestLimitExceeded }) =>
    css({
      position: 'relative',
      margin: `10px 0 ${isExpanded ? 24 : 16}px`,
      paddingLeft: nestLimitExceeded ? 0 : config.indentSizeS,

      [mUp]: {
        paddingLeft: nestLimitExceeded ? 0 : config.indentSizeM
      }
    }),
  verticalToggle: ({ drawLineEnd }) =>
    css({
      ...buttonStyle,
      position: 'absolute',
      top: 0,
      left: -((config.indentSizeS - config.verticalLineWidth) / 2),
      bottom: drawLineEnd ? 20 : 0,
      width: config.indentSizeS,

      [mUp]: {
        left: -((config.indentSizeM - config.verticalLineWidth) / 2),
        width: config.indentSizeM
      },

      '&::before': {
        display: 'block',
        content: '""',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: (config.indentSizeS - config.verticalLineWidth) / 2,
        width: config.verticalLineWidth,
        background: colors.divider,

        [mUp]: {
          left: (config.indentSizeM - config.verticalLineWidth) / 2
        }
      },
      '&:hover::before': {
        background: colors.primary
      },
      ...(drawLineEnd && {
        '&::after': {
          display: 'block',
          content: '""',
          position: 'absolute',
          width: `${config.verticalLineWidth + 2 * 2}px`,
          height: `${config.verticalLineWidth + 2 * 2}px`,
          bottom: -2 - config.verticalLineWidth / 2,
          borderRadius: '100%',
          left: (config.indentSizeS - config.verticalLineWidth) / 2 - 2,
          background: colors.divider,

          [mUp]: {
            left: (config.indentSizeM - config.verticalLineWidth) / 2 - 2
          }
        },
        '&:hover::after': {
          background: colors.primary
        }
      })
    })
}

export const CommentList = ({ t, parentId = null, comments }) => {
  const { actions } = React.useContext(DiscussionContext)

  if (!comments) {
    return null
  }

  const { nodes = [] } = comments

  const numMoreComments = (() => {
    const countComments = comments => {
      if (comments && comments.totalCount) {
        return comments.totalCount || 0
      } else {
        return 0
      }
    }

    const availableCount = nodes.reduce((a, { comments }) => a + 1 + countComments(comments), 0)
    return comments.totalCount - availableCount
  })()

  return (
    <>
      {nodes.map(comment => (
        <CommentNode key={comment.id} t={t} comment={comment} />
      ))}

      {numMoreComments > 0 && (
        <LoadMore
          t={t}
          visualDepth={0}
          count={numMoreComments}
          onClick={() => {
            const after = comments.pageInfo.endCursor

            const appendAfter = (() => {
              const lastNode = nodes[nodes.length - 1]
              return lastNode ? lastNode.id : undefined
            })()

            actions.fetchMoreComments({ parentId, after, appendAfter })
          }}
        />
      )}
    </>
  )
}

/**
 * The Comment component manages the expand/collapse state of its children. It also manages
 * the editor for the comment itself, and composer for replies.
 */
const CommentNode = ({ t, comment }) => {
  const { highlightedCommentId, actions } = React.useContext(DiscussionContext)
  const { id, parentIds, tags, text, comments } = comment

  const isHighlighted = id === highlightedCommentId
  const nestLimitExceeded = parentIds.length > config.nestLimit

  const root = React.useRef()

  /*
   * The local state that the CommentNode component manages.
   *
   * {
   *   mode: 'view' | 'edit'
   *   isExpanded: boolean
   *   showReplyComposer: boolean
   * }
   *
   * Actions
   *
   *  - editComment / closeEditor
   *  - showReplyComposer / closeReplyComposer
   *  - toggleReplies
   */
  const [{ mode, isExpanded, showReplyComposer }, dispatch] = React.useReducer(
    (state, action) => {
      if ('editComment' in action) {
        return { ...state, mode: 'edit' }
      } else if ('closeEditor' in action) {
        return { ...state, mode: 'view' }
      } else if ('showReplyComposer' in action) {
        return { ...state, showReplyComposer: true }
      } else if ('closeReplyComposer' in action) {
        return { ...state, showReplyComposer: false }
      } else if ('toggleReplies' in action) {
        return { ...state, isExpanded: !state.isExpanded }
      } else {
        return state
      }
    },
    { mode: 'view', isExpanded: true, showReplyComposer: false }
  )

  /*
   * Functions which dispatch specific actions. For your convenience.
   */
  const closeEditor = React.useCallback(() => {
    dispatch({ closeEditor: {} })
  }, [dispatch])
  const closeReplyComposer = React.useCallback(() => {
    dispatch({ closeReplyComposer: {} })
  }, [dispatch])

  const toggleReplies = React.useCallback(() => {
    dispatch({ toggleReplies: {} })

    /*
     * When collapsing the node, and the top of the node is outside of the viewport
     * (eg. the user is collapsing a really long thread), scroll up to make sure
     * the node is in the viewport.
     *
     * FIXME: 60 is the header height (plus some), but that height is different
     * on mobile and desktop.
     */
    const topOffset = 60
    if (isExpanded && root.current.getBoundingClientRect().top < topOffset) {
      scrollIntoView(root.current, { align: { top: 0, topOffset } })
    }
  }, [dispatch, isExpanded])

  /*
   * This is an experiment to draw end points at the vertical toggle lines.
   */
  const drawLineEnd = false

  const rootStyle = styles.root({ isExpanded, nestLimitExceeded })

  if (isExpanded) {
    return (
      <div ref={root} data-comment-id={id} {...rootStyle}>
        {!nestLimitExceeded && <button {...styles.verticalToggle({ drawLineEnd })} onClick={toggleReplies} />}
        <div {...(mode === 'view' && isHighlighted ? styles.highlightContainer : {})}>
          {{
            view: () => (
              <>
                <Comment.Header t={t} comment={comment} isExpanded={isExpanded} onToggle={toggleReplies} />
                <div style={{ marginTop: 12 }}>
                  <Comment.Body t={t} comment={comment} context={tags[0] ? { title: tags[0] } : undefined} />
                </div>
              </>
            ),
            edit: () => (
              <CommentComposer
                t={t}
                isRoot={parentIds.length === 0}
                initialText={text}
                tagValue={tags[0]}
                onClose={closeEditor}
                onSubmit={({ text, tags }) =>
                  actions.editComment(comment, text, tags).then(result => {
                    if (result.ok) {
                      closeEditor()
                    }

                    return result
                  })
                }
                onSubmitLabel={t('styleguide/comment/edit/submit')}
              />
            )
          }[mode]()}

          <Comment.Actions
            t={t}
            comment={comment}
            onReply={() => {
              dispatch({ showReplyComposer: {} })
            }}
            onEdit={() => {
              dispatch({ editComment: {} })
            }}
          />
        </div>

        {showReplyComposer && (
          <div style={{ marginBottom: 30 }}>
            <CommentComposer
              t={t}
              isRoot={false /* Replies can never be root comments */}
              onClose={closeReplyComposer}
              onSubmit={({ text, tags }) =>
                actions.submitComment(comment, text, tags).then(result => {
                  if (result.ok) {
                    closeReplyComposer()
                  }

                  return result
                })
              }
            />
          </div>
        )}

        {(() => {
          if (comments && comments.totalCount > 0) {
            return <CommentList t={t} parentId={id} comments={comments} />
          } else {
            return null
          }
        })()}
      </div>
    )
  } else {
    return (
      <div ref={root} data-comment-id={id} {...rootStyle}>
        <button {...styles.verticalToggle({ drawLineEnd })} onClick={toggleReplies} />
        <Comment.Header t={t} comment={comment} isExpanded={isExpanded} onToggle={toggleReplies} />
      </div>
    )
  }
}
