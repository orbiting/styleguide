import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import Textarea from 'react-textarea-autosize'
import scrollIntoView from 'scroll-into-view'
import { mBreakPoint } from '../../../theme/mediaQueries'
import { serifRegular16, sansSerifRegular12 } from '../../Typography/styles'

import { Header, Tags, Actions, Error } from '../Internal/Composer'
import { DiscussionContext } from '../DiscussionContext'
import { convertStyleToRem } from '../../Typography/utils'
import { Embed } from '../Internal/Comment'
import { useDebounce } from '../../../lib/useDebounce'
import { useColorContext } from '../../Colors/ColorContext'
import Loader from '../../Loader'
import { deleteDraft, readDraft, writeDraft } from './CommentDraftHelper'

const styles = {
  root: css({}),
  background: css({
    position: 'relative'
  }),
  textArea: css({
    display: 'block',
    padding: '20px 8px',
    width: '100%',
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: '60px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    ...convertStyleToRem(serifRegular16)
  }),
  textAreaLimit: css({
    paddingBottom: '28px'
  }),
  maxLengthIndicator: css({
    ...convertStyleToRem(sansSerifRegular12),
    lineHeight: 1,
    position: 'absolute',
    bottom: 6,
    left: 8
  }),
  withBorderBottom: css({
    borderBottomWidth: 1,
    borderBottomStyle: 'solid'
  }),
  hints: css({
    marginTop: 6
  })
}

/**
 * The key in localStorage under which we store the text. Keyed by the discussion ID.
 *
 * This is exported from the styleguide so that the frontend can reuse this. In
 * particular, this allows the frontend to directly display the CommentComposer
 * if there is text stored in localStorage.
 */
export const commentComposerStorageKey = discussionId =>
  `commentComposerText:${discussionId}`

export const CommentComposer = props => {
  const {
    t,
    isRoot,
    hideHeader,
    onClose,
    onCloseLabel,
    onSubmitLabel,
    parentId,
    commentId,
    autoFocus = true
  } = props
  const [colorScheme] = useColorContext()
  /*
   * Refs
   *
   * We have one ref that is pointing to the root elment of the comment composer, and
   * another which gives us access to the <Textarea> input element. The later MUST be
   * a function-style ref because <Textarea> doesn't support React.useRef()-style refs.
   */
  const root = React.useRef()
  const [textarea, textareaRef] = React.useState(null)
  const [hints, setHints] = React.useState([])
  const textRef = React.useRef()
  const [preview, setPreview] = React.useState({
    loading: false,
    comment: null
  })

  /*
   * Get the discussion metadata, action callbacks and hinters from DiscussionContext.
   */
  const {
    discussion,
    actions,
    activeTag,
    composerHints = []
  } = React.useContext(DiscussionContext)
  const { id: discussionId, tags, rules, displayAuthor, isBoard } = discussion
  const { maxLength } = rules

  /*
   * Synchronize the text with localStorage, and restore it from there if not otherwise
   * provided through props. This way the user won't lose their text if the browser
   * crashes or if they inadvertently close the composer.
   */
  const [text, setText] = React.useState(() => {
    if (props.initialText) {
      return props.initialText
    } else if (typeof localStorage !== 'undefined') {
      try {
        return readDraft(discussionId, commentId) ?? ''
      } catch (e) {
        return ''
      }
    } else {
      return ''
    }
  })

  const textLength = preview.comment
    ? preview.comment.contentLength
    : text.length

  const [tagValue, setTagValue] = React.useState(
    props.tagValue || (isRoot && activeTag)
  )

  /*
   * Focus the textarea upon mount.
   *
   * Furthermore, if we detect a small screen, scroll the whole elment to the top of
   * the viewport.
   */
  React.useEffect(() => {
    if (textarea && autoFocus) {
      textarea.focus()

      if (window.innerWidth < mBreakPoint) {
        scrollIntoView(root.current, { align: { top: 0, topOffset: 60 } })
      }
    }
  }, [textarea, autoFocus])

  const previewCommentAction = actions.previewComment
  const [slowText] = useDebounce(text, 400)
  textRef.current = text
  React.useEffect(() => {
    setTagValue(isRoot ? activeTag : null)
    if (!isBoard || !isRoot || !previewCommentAction) {
      return
    }
    if (!slowText || slowText.indexOf('http') === -1) {
      setPreview({
        comment: null,
        loading: false
      })
      return
    }
    setPreview(preview => ({
      ...preview,
      loading: true
    }))
    previewCommentAction({
      content: slowText,
      discussionId,
      parentId,
      id: commentId
    })
      .then(nextPreview => {
        if (textRef.current === slowText) {
          setPreview({
            comment: nextPreview,
            loading: false
          })
        }
      })
      .catch(() => {
        if (textRef.current === slowText) {
          setPreview({
            comment: null,
            loading: false
          })
        }
      })
  }, [
    slowText,
    previewCommentAction,
    isRoot,
    discussionId,
    commentId,
    parentId,
    isBoard,
    activeTag
  ])

  const onChangeText = ev => {
    const nextText = ev.target.value
    setText(nextText)
    setHints(composerHints.map(fn => fn(nextText)).filter(Boolean))
    try {
      writeDraft(discussionId, commentId, ev.target.value)
    } catch (e) {
      /* Ignore errors */
    }
  }

  /*
   * We keep track of the submission process, to prevent the user from
   * submitting the comment multiple times.
   *
   * This also enables us to show a loading indicator.
   */
  const [{ loading, error }, setSubmit] = React.useState({
    loading: false,
    error: undefined
  })
  const onSubmit = () => {
    if (root.current) {
      setSubmit({ loading: true, error })
      props
        .onSubmit({ text, tags: tagValue ? [tagValue] : undefined })
        .then(({ ok, error }) => {
          /*
           * We may have been umounted in the meantime, so we use 'root.current' as a signal that
           * we have been so we can avoid calling React setState functions which generate warnings.
           *
           * In the case of success, we keep 'loading' true, to keep the onSubmit button disabled.
           * Otherwise it might become active again before our controller closes us, allowing the
           * user to click it again.
           */

          if (ok) {
            try {
              deleteDraft(discussionId, commentId)
            } catch (e) {
              /* Ignore */
            }

            if (root.current) {
              setSubmit({ loading: true, error: undefined })
            }
          } else {
            if (root.current) {
              setSubmit({ loading: false, error })
            }
          }
        })
    }
  }

  const textAreaEmptyRule = useMemo(
    () =>
      css({
        color: colorScheme.getCSSColor('textSoft'),
        '::-webkit-input-placeholder': {
          color: colorScheme.getCSSColor('textSoft')
        }
      }),
    [colorScheme]
  )

  return (
    <div ref={root} {...styles.root}>
      <div {...styles.background} {...colorScheme.set('background', 'hover')}>
        {!hideHeader && (
          <div
            {...styles.withBorderBottom}
            {...colorScheme.set('borderColor', 'default')}
          >
            <Header
              t={t}
              displayAuthor={displayAuthor}
              onClick={actions.openDiscussionPreferences}
            />
          </div>
        )}

        {/* Tags are only available in the root composer! */}
        {isRoot && tags && (
          <div
            {...styles.withBorderBottom}
            {...colorScheme.set('borderColor', 'default')}
          >
            <Tags tags={tags} onChange={setTagValue} value={tagValue} />
          </div>
        )}

        <Textarea
          inputRef={textareaRef}
          {...styles.textArea}
          {...colorScheme.set('color', 'text')}
          {...(maxLength ? styles.textAreaLimit : {})}
          {...(text === '' ? textAreaEmptyRule : {})}
          placeholder={t('styleguide/CommentComposer/placeholder')}
          value={text}
          rows='1'
          onChange={onChangeText}
        />

        {maxLength && (
          <MaxLengthIndicator maxLength={maxLength} length={textLength} />
        )}
      </div>
      {hints &&
        hints.map((hint, index) => (
          <div {...styles.hints} key={`hint-${index}`}>
            {hint}
          </div>
        ))}

      <Loader
        loading={preview.loading && !(preview.comment && preview.comment.embed)}
        render={() => <Embed comment={preview.comment} />}
      />

      <Actions
        t={t}
        onClose={() => {
          onClose()
          // Delete the draft of the field
          deleteDraft(discussionId, commentId)
        }}
        onCloseLabel={onCloseLabel}
        onSubmit={
          loading || (maxLength && textLength > maxLength)
            ? undefined
            : onSubmit
        }
        onSubmitLabel={onSubmitLabel}
      />

      {error && <Error>{error}</Error>}
    </div>
  )
}

CommentComposer.propTypes = {
  t: PropTypes.func.isRequired,
  isRoot: PropTypes.bool.isRequired,
  hideHeader: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onCloseLabel: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onSubmitLabel: PropTypes.string
}

const MaxLengthIndicator = ({ maxLength, length }) => {
  const [colorScheme] = useColorContext()
  const remaining = maxLength - length
  if (remaining > maxLength * 0.33) {
    return null
  }

  return (
    <div
      {...styles.maxLengthIndicator}
      {...colorScheme.set(
        'color',
        remaining < 0 ? 'error' : remaining < 21 ? 'text' : 'textSoft'
      )}
    >
      {remaining}
    </div>
  )
}
