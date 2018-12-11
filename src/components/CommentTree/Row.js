import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {css} from 'glamor'

import {Comment, CommentActions} from '../Comment'
import {profilePictureSize, profilePictureMargin} from '../Comment/CommentHeader'
import CommentComposer from '../CommentComposer/CommentComposer'
import {DepthBars, getWidth} from './DepthBar'

const styles = {
  root: css({
    display: 'flex'
  }),
  commentComposerContainer: css({
    marginTop: '20px',
    transition: 'opacity .2s'
  }),
}

const Row = ({
  t,
  visualDepth,
  head,
  tail,
  otherChild,
  comment,
  displayAuthor,
  showComposer,
  composerError,
  onEditPreferences,
  onAnswer,
  edit,
  onUnpublish,
  onShare,
  onUpvote,
  onDownvote,
  dismissComposer,
  submitComment,
  highlighted,
  timeago,
  maxLength,
  replyBlockedMsg,
  Link,
  secondaryActions,
  collapsed,
  onToggleCollapsed,
  onShouldCollapse,
  tags,
  onTagChange,
  tagValue,
  context
}) => {
  const isEditing = edit && edit.isEditing
  const { downVotes, upVotes } = comment

  const barCount = visualDepth - (otherChild ? 1 : 0)

  return (
    <div {...styles.root}>
      <DepthBars count={barCount} head={head} tail={tail} />
      <div style={{flexGrow: 1, flexBasis: 0, margin: otherChild ? '20px 0' : `20px 0 20px -${profilePictureSize + profilePictureMargin}px`, width: `calc(100% - ${getWidth(barCount)}px)`}}>
        {!isEditing && <Comment
          {...comment}
          highlighted={highlighted}
          Link={Link}
          timeago={timeago}
          t={t}
          collapsed={collapsed}
          onShouldCollapse={onShouldCollapse}
          context={context}
        />}
        {isEditing && (
          <div style={{marginBottom: 20}}>
            <CommentComposer
              t={t}
              initialText={comment.text}
              displayAuthor={displayAuthor}
              error={edit.error}
              onEditPreferences={onEditPreferences}
              onCancel={edit.cancel}
              submitComment={edit.submit}
              submitLabel={t('styleguide/comment/edit/submit')}
              maxLength={maxLength}
              secondaryActions={secondaryActions}
              tags={tags}
              onTagChange={onTagChange}
              tagValue={tagValue}
            />
          </div>
        )}

        <div style={{marginLeft: profilePictureSize + profilePictureMargin}}>
          <CommentActions
            t={t}
            downVotes={downVotes}
            upVotes={upVotes}
            onAnswer={onAnswer}
            onEdit={edit && edit.start}
            onUnpublish={onUnpublish}
            onShare={onShare}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
            replyBlockedMsg={replyBlockedMsg}
            highlighted={highlighted}
            collapsed={collapsed}
            onToggleCollapsed={onToggleCollapsed}
          />

          {(displayAuthor && showComposer) &&
            <Composer
              t={t}
              displayAuthor={displayAuthor}
              error={composerError}
              onEditPreferences={onEditPreferences}
              onCancel={dismissComposer}
              submitComment={submitComment}
              maxLength={maxLength}
              secondaryActions={secondaryActions}
            />
          }
        </div>
      </div>
    </div>
  )
}

Row.propTypes = {
  t: PropTypes.func.isRequired,
  visualDepth: PropTypes.number.isRequired,
  head: PropTypes.bool.isRequired,
  tail: PropTypes.bool.isRequired,
  otherChild: PropTypes.bool,
  comment: PropTypes.object.isRequired,
  displayAuthor: PropTypes.object,
  showComposer: PropTypes.bool.isRequired,
  composerError: PropTypes.string,
  onEditPreferences: PropTypes.func.isRequired,
  onAnswer: PropTypes.func,
  onUnpublish: PropTypes.func,
  onShare: PropTypes.func,
  onUpvote: PropTypes.func,
  onDownvote: PropTypes.func,
  dismissComposer: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
  highlighted: PropTypes.bool,
  timeago: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  replyBlockedMsg: PropTypes.string,
  Link: PropTypes.func,
  secondaryActions: PropTypes.object,
  collapsed: PropTypes.bool,
  onToggleCollapsed: PropTypes.func,
  onShouldCollapse: PropTypes.func
}

class Composer extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {isVisible: false}
  }
  componentDidMount () {
    this.setState({isVisible: true})
  }

  render () {
    const {t, displayAuthor, error, onEditPreferences, onCancel, submitComment, maxLength, secondaryActions} = this.props
    const {isVisible} = this.state

    return (
      <div {...styles.commentComposerContainer} style={{opacity: isVisible ? 1 : 0}}>
        <CommentComposer
          t={t}
          displayAuthor={displayAuthor}
          error={error}
          onEditPreferences={onEditPreferences}
          onCancel={onCancel}
          submitComment={submitComment}
          maxLength={maxLength}
          secondaryActions={secondaryActions}
        />
      </div>
    )
  }
}

Composer.propTypes = {
  t: PropTypes.func.isRequired,
  displayAuthor: PropTypes.object.isRequired,
  error: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
  maxLength: PropTypes.number
}

class RowState extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      composerState: 'idle', // idle | focused | submitting | error
      composerError: undefined, // or string
      shouldCollapse: false,
      collapsed: !!props.collapsable,
      tagValue: props.selectedTag
    }

    this.openComposer = () => {
      this.setState({
        composerState: 'focused',
        composerError: undefined
      })
    }
    this.dismissComposer = () => {
      this.setState({
        composerState: 'idle',
        composerError: undefined
      })
    }

    this.upvoteComment = () => {
      this.props.upvoteComment(this.props.comment.id)
    }
    this.downvoteComment = () => {
      this.props.downvoteComment(this.props.comment.id)
    }
    this.submitComment = (content) => {
      this.setState({composerState: 'submitting'})
      this.props.submitComment(this.props.comment, content).then(
        () => {
          this.setState({
            composerState: 'idle',
            composerError: undefined
          })
        },
        (e) => {
          this.setState({
            composerState: 'error',
            composerError: e
          })
        }
      )
    }
    this.toggleCollapsed = () => {
      this.setState({collapsed: !this.state.collapsed})
    }

    this.onShouldCollapse = () => {
      this.setState({shouldCollapse: true})
    }

    this.onTagChange = (tagValue) => {
      this.setState({tagValue})
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!!nextProps.highlighted) {
      this.setState({collapsed: false})
    }
  }

  render () {
    const {
      t,
      timeago,
      comment,
      highlighted,
      visualDepth, head, tail,
      otherChild,
      displayAuthor,
      onEditPreferences,
      onShare,
      isAdmin,
      maxLength,
      replyBlockedMsg,
      Link,
      secondaryActions,
      collapsable,
      tags,
      context
    } = this.props
    const {composerState, composerError, collapsed, shouldCollapse, tagValue} = this.state
    const {userVote} = comment

    const edit = comment.userCanEdit && {
      start: () => {
        this.setState({
          isEditing: true,
          editError: undefined
        })
      },
      submit: content => {
        const tags = this.state.tagValue ? [this.state.tagValue] : undefined
        this.props.editComment(comment, content, tags)
          .then(() => {
            this.setState({
              isEditing: false
            })
          })
          .catch(e => {
            this.setState({
              editError: e
            })
          })
      },
      cancel: () => {
        this.setState({
          isEditing: false
        })
      },
      isEditing: this.state.isEditing,
      error: this.state.editError
    }

    const collapseAttributes = collapsable
      ? {
          collapsed: shouldCollapse ? collapsed : undefined,
          onShouldCollapse: this.onShouldCollapse,
          onToggleCollapsed: this.toggleCollapsed
        }
      : undefined

    return (
      <Row
        t={t}
        visualDepth={visualDepth}
        head={head}
        tail={tail}
        otherChild={otherChild}
        comment={comment}
        highlighted={highlighted}
        displayAuthor={displayAuthor}
        showComposer={composerState !== 'idle'}
        composerError={composerError}
        onEditPreferences={onEditPreferences}
        onAnswer={displayAuthor ? this.openComposer : undefined}
        onUpvote={(!displayAuthor || userVote === 'UP') ? undefined : this.upvoteComment}
        onDownvote={(!displayAuthor || userVote === 'DOWN') ? undefined : this.downvoteComment}
        onUnpublish={
          (isAdmin || comment.userCanEdit) && comment.published
          ? (() => this.props.unpublishComment(comment.id))
          : undefined
        }
        onShare={onShare ? (() => onShare(comment.id)) : undefined}
        dismissComposer={this.dismissComposer}
        submitComment={this.submitComment}
        edit={edit}
        timeago={timeago}
        maxLength={maxLength}
        replyBlockedMsg={replyBlockedMsg}
        Link={Link}
        secondaryActions={secondaryActions}
        tags={tags}
        onTagChange={this.onTagChange}
        tagValue={tagValue}
        context={context}
        {...collapseAttributes}
      />
    )
  }

}

export default RowState
