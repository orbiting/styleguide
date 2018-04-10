import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {css} from 'glamor'
import Textarea from 'react-textarea-autosize';
import colors from '../../theme/colors'
import {serifRegular16, sansSerifRegular14, sansSerifRegular16} from '../Typography/styles'

import CommentComposerHeader from './CommentComposerHeader'
import CommentComposerError from './CommentComposerError'
import CommentComposerProgress from './CommentComposerProgress'

const actionButtonStyle = {
  ...sansSerifRegular16,
  outline: 'none',
  WebkitAppearance: 'none',
  background: 'transparent',
  border: 'none',
  padding: '0 12px',
  cursor: 'pointer',
  alignSelf: 'stretch',
  display: 'flex',
  alignItems: 'center'
}

const styles = {
  form: css({
    background: colors.secondaryBg,
    borderTop: '1px solid white'
  }),
  textArea: css({
    padding: '6px 12px 0',
    width: '100%',
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: '60px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    ...serifRegular16,
    color: colors.text
  }),
  textAreaEmpty: css({
    color: colors.lightText,
    '::-webkit-input-placeholder': {
      color: colors.lightText
    }
  }),
  limit: css({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0 12px'
  }),
  remaining: css({
    ...sansSerifRegular14,
    lineHeight: '20px',
    padding: '0 3px'
  }),
  actions: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '40px'
  }),
  mainActions: css({
    display: 'flex',
    alignItems: 'center',
    height: '40px'
  }),
  cancelButton: css({
    ...actionButtonStyle,
    color: colors.text
  }),
  commitButton: css({
    ...actionButtonStyle,
    color: colors.primary,
    '&[disabled]': {
      color: colors.disabled
    }
  }),
  etiquette: css({
    ...sansSerifRegular16,
    color: colors.primary,
    cursor: 'pointer',
    padding: '0 12px',
    textDecoration: 'none'
  })
}

const DefaultLink = ({ children }) => children

class CommentComposer extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      text: props.initialText || '',
      count: 0,
      progress: 0
    }

    this.onChange = ev => {
      this.setState({text: ev.target.value})
      this.updateLimit()
    }

    this.onSubmit = () => {
      this.props.submitComment(this.state.text)
    }

    this.textarea = null
    this.textareaRef = (ref) => {
      this.textarea = ref
    }

    this.getCount = () => (
      (this.textarea && this.textarea.value.length) || 0
    )
  }

  updateLimit () {
    if (this.props.limit) {
      this.setState({count: this.getCount()})
      this.setState({progress: this.getCount() / this.props.limit * 100})
    }
  }

  componentDidMount () {
    if (this.textarea) {
      this.textarea.focus()
      this.updateLimit()
    }
  }

  render () {
    const {
      t,
      displayAuthor,
      error,
      onEditPreferences,
      onCancel,
      submitLabel,
      cancelLabel,
      etiquetteLabel,
      EtiquetteLink = DefaultLink,
      limit
    } = this.props
    const {text, count, progress} = this.state

    const limitExceeded = limit && count > limit
    const showCount = limit && limit - count < 21
    const progressColor = limit && progress > 100 ? colors.error : colors.text

    return (
      <div>
        <CommentComposerHeader
          {...displayAuthor}
          onClick={onEditPreferences}
        />

        <div {...styles.form}>
          <Textarea
            inputRef={this.textareaRef}
            {...styles.textArea}
            {...(text === '' ? styles.textAreaEmpty : {})}
            placeholder={t('styleguide/CommentComposer/placeholder')}
            value={text}
            rows='1'
            onChange={this.onChange}
          />
          {limit && <div {...styles.limit}>
            {showCount && <span {...styles.remaining} style={{color: progressColor}}>
              {limit - count}
            </span>}
            <CommentComposerProgress
              stroke={progressColor}
              radius={12}
              strokeWidth={2}
              progress={Math.min(progress, 100)}
            />
          </div>}

          <div {...styles.actions}>
            <EtiquetteLink passHref>
              <a {...styles.etiquette}>
                {etiquetteLabel || t('styleguide/CommentComposer/etiquette')}
              </a>
            </EtiquetteLink>
            <div {...styles.mainActions}>
              <button {...styles.cancelButton} onClick={onCancel}>
                {cancelLabel || t('styleguide/CommentComposer/cancel')}
              </button>
              <button {...styles.commitButton} onClick={this.onSubmit} disabled={limitExceeded}>
                {submitLabel || t('styleguide/CommentComposer/answer')}
              </button>
            </div>
          </div>
        </div>
        {error && <CommentComposerError>{error}</CommentComposerError>}
      </div>
    )
  }
}

CommentComposer.propTypes = {
  t: PropTypes.func.isRequired,
  displayAuthor: PropTypes.object.isRequired,
  error: PropTypes.string,
  onEditPreferences: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  etiquetteLabel: PropTypes.string,
  EtiquetteLink: PropTypes.func,
  limit: PropTypes.number
}

export default CommentComposer
