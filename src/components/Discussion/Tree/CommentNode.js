import React, { useMemo } from 'react'
import { DiscussionContext } from '../DiscussionContext'
import * as config from '../config'
import { useColorContext } from '../../Colors/ColorContext'
import { readDraft } from '../Composer/CommentDraftHelper'
import scrollIntoView from 'scroll-into-view'
import { css, merge } from 'glamor'
import * as Comment from '../Internal/Comment'
import { CommentComposer } from '../Composer'
import { CommentList } from './CommentList'
import { mUp } from '../../../theme/mediaQueries'
import {
  FavoriteIcon,
  FeaturedIcon,
  ReportIcon,
  UnfoldLessIcon,
  UnfoldMoreIcon,
  UnpublishIcon
} from '../../Icons'
import IconButton from '../../IconButton'

const buttonStyle = {
  display: 'block',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
  padding: 0
}

const styles = {
  highlightContainer: css({
    padding: '7px 7px 0 7px',
    margin: '0 -7px 12px -7px'
  }),
  boardColumn: css({
    [mUp]: {
      flex: '1 0 auto',
      padding: 10,
      width: '50%'
    }
  }),
  showMUp: css({
    display: 'none',
    [mUp]: {
      display: 'block'
    }
  }),
  hideMUp: css({
    [mUp]: {
      display: 'none'
    }
  }),
  modalRoot: css({
    marginBottom: 15
  }),
  hiddenToggle: css({ display: 'none' }),
  commentWrapper: ({ isExpanded }) =>
    css({
      /*
       * On larger screens, hide the action button and reveal only on hover.
       */
      [mUp]: isExpanded && {
        '@media (hover)': {
          [`& [data-${Comment.headerActionStyle({ isExpanded })}]`]: {
            display: 'none'
          },
          [`&:hover [data-${Comment.headerActionStyle({ isExpanded })}]`]: {
            display: 'block'
          }
        }
      }
    }),
  root: ({ isExpanded, nestLimitExceeded, depth, board }) =>
    css({
      background: 'transparent',
      position: 'relative',
      margin: `10px 0 ${(isExpanded ? 24 : 16) + (depth === 0 ? 20 : 0)}px`,
      paddingLeft: nestLimitExceeded || depth < 1 ? 0 : config.indentSizeS,
      [mUp]: {
        paddingLeft: nestLimitExceeded || depth < 1 ? 0 : config.indentSizeM,
        ...(board
          ? {
              display: 'flex',
              marginLeft: -10,
              marginRight: -10,
              marginBottom: 50
            }
          : {})
      }
    }),
  verticalToggle: ({ drawLineEnd, depth, isExpanded, isLast }) =>
    css({
      ...buttonStyle,
      position: 'absolute',
      top: 0,
      left: -((config.indentSizeS - config.verticalLineWidth) / 2),
      bottom:
        (drawLineEnd ? 20 : 0) -
        (depth === 1 && !isLast ? (isExpanded ? 24 : 16) : 0),
      width: config.indentSizeS,

      [mUp]: {
        left: -((config.indentSizeM - config.verticalLineWidth) / 2),
        width: config.indentSizeM
      },
      '&> *': {
        position: 'absolute',
        top: 0,
        left: 0
      },
      '::before': {
        display: 'block',
        content: '""',
        position: 'absolute',
        top: 25,
        bottom: 0,
        left: (config.indentSizeS - config.verticalLineWidth) / 2,
        width: config.verticalLineWidth,
        [mUp]: {
          left: (config.indentSizeM - config.verticalLineWidth) / 2
        }
      },
      ...(drawLineEnd
        ? {
            '::after': {
              display: 'block',
              content: '""',
              position: 'absolute',
              width: `${config.verticalLineWidth + 2 * 2}px`,
              height: `${config.verticalLineWidth + 2 * 2}px`,
              bottom: -2 - config.verticalLineWidth / 2,
              borderRadius: '100%',
              left: (config.indentSizeS - config.verticalLineWidth) / 2 - 2,
              [mUp]: {
                left: (config.indentSizeM - config.verticalLineWidth) / 2 - 2
              }
            }
          }
        : {})
    }),
  menuWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    '> *:not(:last-child)': {
      marginBottom: '1rem'
    }
  })
}

/**
 * The Comment component manages the expand/collapse state of its children.
 * It also manages
 * the editor for the comment itself, and composer for replies.
 */
const CommentNode = ({
  t,
  discussion,
  comment,
  board,
  rootCommentOverlay,
  isLast
}) => {
  const {
    highlightedCommentId,
    activeTag,
    actions,
    isAdmin
  } = React.useContext(DiscussionContext)
  const { id, parentIds, tags, text, comments } = comment
  const { displayAuthor } = discussion
  const isHighlighted = id === highlightedCommentId
  const depth = parentIds.length
  const nestLimitExceeded = depth > config.nestLimit
  const isRoot = depth === 0
  const root = React.useRef()
  const [colorScheme] = useColorContext()

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

  const [
    { mode, isExpanded, showReplyComposer, replyComposerAutoFocus },
    dispatch
  ] = React.useReducer(
    (state, action) => {
      if ('editComment' in action) {
        return { ...state, mode: 'edit' }
      } else if ('closeEditor' in action) {
        return { ...state, mode: 'view' }
      } else if ('showReplyComposer' in action) {
        return {
          ...state,
          showReplyComposer: true,
          replyComposerAutoFocus: true
        }
      } else if ('closeReplyComposer' in action) {
        return { ...state, showReplyComposer: false }
      } else if ('toggleReplies' in action) {
        return { ...state, isExpanded: !state.isExpanded }
      } else {
        return state
      }
    },
    {
      mode: 'view',
      isExpanded: true,
      replyComposerAutoFocus: false,
      showReplyComposer:
        (!!displayAuthor &&
          isRoot &&
          !!rootCommentOverlay &&
          !(comments && comments.nodes && comments.nodes.length)) ||
        readDraft(discussion.id, comment.id)
    }
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

  const rootStyle = styles.root({ isExpanded, nestLimitExceeded, depth, board })
  const verticalToggleStyle =
    !isRoot && styles.verticalToggle({ isExpanded, depth, drawLineEnd, isLast })
  const verticalToggleStyleRules = useMemo(
    () =>
      css({
        '::before': { background: colorScheme.getCSSColor('divider') },
        '@media (hover)': {
          ':hover::before': {
            background: colorScheme.getCSSColor('primary')
          },
          ':hover::after': {
            background: drawLineEnd
              ? colorScheme.getCSSColor('primary')
              : 'none'
          }
        },
        '::after': {
          background: drawLineEnd ? colorScheme.getCSSColor('divider') : 'none'
        }
      }),
    [colorScheme, drawLineEnd]
  )

  // Returns the content of the more-button, located in the top right of the header.
  const menu = useMemo(() => {
    const items = []

    if (isAdmin) {
      items.push({
        icon: ReportIcon,
        label: t('styleguide/CommentActions/report')
      })
    }

    if (actions.featureComment) {
      items.push({
        icon: FeaturedIcon,
        label: t('styleguide/CommentActions/feature')
      })
    }

    // TODO: Implement highlight logic
    if (true) {
      items.push({
        icon: FavoriteIcon,
        label: t('styleguide/CommentActions/highlight')
      })
    }

    if (isAdmin) {
      items.push({
        icon: UnpublishIcon,
        label: t('styleguide/CommentActions/unpublish')
      })
    }

    return (
      <div {...styles.menuWrapper}>
        {items.map(item => (
          <IconButton
            key={item.label}
            Icon={item.icon}
            label={item.label}
            labelShort={item.label}
          />
        ))}
      </div>
    )
  }, [])

  if (isExpanded) {
    return (
      <div ref={root} data-comment-id={id} {...rootStyle}>
        {!nestLimitExceeded && !board && verticalToggleStyle && (
          <button
            {...verticalToggleStyle}
            {...verticalToggleStyleRules}
            onClick={toggleReplies}
          >
            <UnfoldLessIcon />
          </button>
        )}
        <div
          {...merge(
            mode === 'view' && isHighlighted ? styles.highlightContainer : {},
            board ? styles.boardColumn : null,
            isRoot && rootCommentOverlay ? styles.modalRoot : null
          )}
          {...(mode === 'view' &&
            isHighlighted &&
            colorScheme.set('backgroundColor', 'alert'))}
        >
          {{
            view: () => (
              <div {...styles.commentWrapper({ isExpanded })}>
                <Comment.Header
                  t={t}
                  comment={comment}
                  isExpanded={isExpanded}
                  onToggle={
                    !board && !(isRoot && rootCommentOverlay) && toggleReplies
                  }
                  menu={menu}
                />
                <div style={{ marginTop: 12 }}>
                  <Comment.Body
                    t={t}
                    comment={comment}
                    context={
                      !activeTag && tags[0] ? { title: tags[0] } : undefined
                    }
                  />
                  {(board || (rootCommentOverlay && isRoot)) && (
                    <div
                      {...styles.hideMUp}
                      style={{ marginTop: rootCommentOverlay ? 15 : null }}
                    >
                      <Comment.Embed comment={comment} />
                    </div>
                  )}
                </div>
              </div>
            ),
            edit: () => (
              <CommentComposer
                t={t}
                isRoot={isRoot}
                commentId={comment.id}
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
            onExpand={
              board &&
              (() => {
                actions.fetchMoreComments({ parentId: id, after: {} })
              })
            }
            onReply={
              !board &&
              (() => {
                dispatch({ showReplyComposer: {} })
              })
            }
            /*
            onEdit={() => {
              dispatch({ editComment: {} })
            }}
            onReport={() => {
              actions.reportComment(comment)
            }}
            */
          />
        </div>

        {board && (
          <div {...styles.boardColumn} {...styles.showMUp}>
            <Comment.Embed comment={comment} />
          </div>
        )}

        {showReplyComposer && (
          <div style={{ marginBottom: 30 }}>
            <CommentComposer
              t={t}
              isRoot={false /* Replies can never be root comments */}
              parentId={comment.id}
              commentId={comment.id}
              onClose={closeReplyComposer}
              autoFocus={replyComposerAutoFocus}
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

        {!board && (
          <CommentList
            t={t}
            parentId={id}
            comments={comments}
            rootCommentOverlay={rootCommentOverlay}
          />
        )}
      </div>
    )
  } else {
    return (
      <div ref={root} data-comment-id={id} {...rootStyle}>
        {verticalToggleStyle && (
          <button {...verticalToggleStyle} onClick={toggleReplies}>
            <UnfoldMoreIcon />
          </button>
        )}
        <Comment.Header
          t={t}
          comment={comment}
          isExpanded={isExpanded}
          onToggle={toggleReplies}
        />
      </div>
    )
  }
}

export default CommentNode