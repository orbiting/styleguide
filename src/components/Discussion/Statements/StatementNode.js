import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { fontStyles, Label } from '../../Typography'
import { useMemo } from 'react'
import { getUniqueColorTagName } from './helpers/colorHelper'
import { VoteButtons } from '../Internal/Comment'
import { mUp } from '../../../theme/mediaQueries'
import { useColorContext } from '../../Colors/ColorContext'
import { stripTag } from './helpers/tagHelper'
import { renderCommentMdast } from '../Internal/Comment/render'
import IconButton from '../../IconButton'
import { ShareIcon } from '../../Icons'
import ActionsMenu, {
  ActionsMenuItemPropType
} from '../Internal/Comment/ActionsMenu'
import HeaderMetaLine from '../Internal/Comment/HeaderMetaLine'
import { pxToRem } from '../../Typography/utils'

const HIGHLIGHT_PADDING = 7

const styles = {
  root: css({
    display: 'grid',
    gap: '.5rem',
    [mUp]: {
      gap: '.5rem 1rem'
    }
  }),
  highlightedContainer: css({
    padding: HIGHLIGHT_PADDING,
    margin: `0 -${HIGHLIGHT_PADDING}px`
  }),
  withProfilePicture: css({
    gridTemplateAreas: `
      "portrait heading menu"
      "text text text"
      "actions vote vote"
    `,
    gridTemplateColumns: 'minmax(60px, max-content) minmax(0, 1fr) max-content',
    gridTemplateRows: 'auto auto auto',
    [mUp]: {
      gridTemplateAreas: `
      "portrait heading menu"
      "portrait text text"
      "portrait actions vote"
    `,
      gridTemplateColumns:
        'minmax(100px, max-content) minmax(0, 1fr) max-content',
      gridTemplateRows: 'max-content auto auto'
    }
  }),
  withOutProfilePicture: css({
    gridTemplateAreas: `
      "heading menu"
      "text text"
      "actions vote"
    `,
    gridTemplateColumns: 'minmax(0, 1fr) max-content',
    gridTemplateRows: 'auto auto auto auto'
  }),
  profilePictureWrapper: css({
    gridArea: 'portrait',
    // Offset to perfectly align with the capital-letters in the heading
    paddingTop: pxToRem(3),
    [mUp]: {
      paddingTop: pxToRem(4)
    }
  }),
  profilePicture: css({
    display: 'block',
    width: 60,
    height: 60,
    [mUp]: {
      width: 100,
      height: 100
    }
  }),
  headingWrapper: css({
    gridArea: 'heading'
  }),
  textWrapper: css({
    gridArea: 'text'
  }),
  unpublishedText: css({
    // Next line is needed for opacity to apply
    display: 'inherit',
    opacity: 0.5
  }),
  heading: css({
    margin: 0,
    ...fontStyles.sansSerifMedium,
    fontSize: pxToRem(18),
    lineHeight: pxToRem(20),
    [mUp]: {
      fontSize: pxToRem(22),
      lineHeight: pxToRem(24)
    }
  }),
  actionWrapper: css({
    gridArea: 'actions',
    alignSelf: 'center'
  }),
  menuWrapper: css({
    gridArea: 'menu',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }),
  voteWrapper: css({
    gridArea: 'vote',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }),
  link: css({
    color: 'inherit',
    textDecoration: 'none'
  })
}

const StatementNode = ({
  comment,
  tagMappings = [],
  t,
  actions: { handleUpVote, handleDownVote, handleUnVote, handleShare },
  menuItems = [],
  disableVoting = false,
  isHighlighted = false,
  Link,
  CommentLink,
  profileHref
}) => {
  const [colorScheme] = useColorContext()

  const tag = comment.tags.length > 0 && comment.tags[0]

  const tagMapper = useMemo(() => {
    const tagMapping = tagMappings.find(m => stripTag(m.tag) === stripTag(tag))

    return (
      tagMapping || {
        text: '{user}'
      }
    )
  }, [comment, tag, tagMappings])

  const heading = useMemo(() => {
    if (!comment.published || comment?.adminUnpublished) {
      return {
        color: 'disabled',
        text: comment.adminUnpublished
          ? t('styleguide/comment/header/unpublishedByAdmin')
          : comment.unavailable
          ? t('styleguide/comment/header/unavailable')
          : t('styleguide/comment/header/unpublishedByUser')
      }
    }

    return {
      color: getUniqueColorTagName(tag),
      text: tagMapper.text.replace('{user}', comment?.displayAuthor?.name)
    }
  }, [comment, tag, tagMapper])

  const showProfilePicture =
    comment.displayAuthor?.profilePicture !== null && comment.published

  const commentText = useMemo(
    () => (comment?.content ? renderCommentMdast(comment.content) : null),
    [comment?.content]
  )

  const unpublishedMessage = useMemo(() => {
    if (comment.userCanEdit && comment?.adminUnpublished) {
      return <Label>{t('styleguide/comment/adminUnpublished')}</Label>
    }

    if (comment.userCanEdit && !comment.published) {
      return <Label>{t('styleguide/comment/unpublished/userCanEdit')}</Label>
    }

    return null
  }, [comment?.published, comment?.adminUnpublished])

  const profileImgElement = showProfilePicture && (
    <img
      {...styles.profilePicture}
      alt={comment.displayAuthor.name}
      src={comment.displayAuthor.profilePicture}
    />
  )

  return (
    <div
      {...styles.root}
      {...(showProfilePicture
        ? styles.withProfilePicture
        : styles.withOutProfilePicture)}
      {...(isHighlighted ? styles.highlightedContainer : {})}
      {...(isHighlighted ? colorScheme.set('backgroundColor', 'alert') : {})}
      data-comment-id={comment.id}
    >
      {showProfilePicture && (
        <div {...styles.profilePictureWrapper}>
          {profileHref ? (
            <Link href={profileHref} passHref>
              <a {...styles.link}>{profileImgElement}</a>
            </Link>
          ) : (
            profileImgElement
          )}
        </div>
      )}
      <div {...styles.headingWrapper}>
        <p {...styles.heading} {...colorScheme.set('color', heading.color)}>
          {profileHref ? (
            <Link href={profileHref} passHref>
              <a {...styles.link}>{heading.text}</a>
            </Link>
          ) : (
            heading.text
          )}
        </p>
        <HeaderMetaLine t={t} comment={comment} CommentLink={CommentLink} />
      </div>
      <div {...styles.textWrapper}>
        <span
          {...(!comment?.published || comment.adminUnpublished
            ? styles.unpublishedText
            : {})}
        >
          {commentText}
        </span>
        {unpublishedMessage}
      </div>
      <div {...styles.actionWrapper}>
        <IconButton
          title={t('styleguide/CommentActions/share')}
          label={t('styleguide/CommentActions/share/short')}
          labelShort={t('styleguide/CommentActions/share/short')}
          Icon={ShareIcon}
          onClick={() => handleShare(comment)}
          size={20}
        />
      </div>
      {menuItems && (
        <div {...styles.menuWrapper}>
          <ActionsMenu items={menuItems} />
        </div>
      )}
      <div {...styles.voteWrapper}>
        <VoteButtons
          t={t}
          disabled={disableVoting}
          comment={comment}
          handleUpVote={handleUpVote}
          handleDownVote={handleDownVote}
          handleUnVote={handleUnVote}
        />
      </div>
    </div>
  )
}

export default StatementNode

StatementNode.propTypes = {
  comment: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  tagMappings: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ),
  actions: PropTypes.shape({
    handleUpVote: PropTypes.func.isRequired,
    handleDownVote: PropTypes.func.isRequired,
    handleUnVote: PropTypes.func.isRequired,
    handleShare: PropTypes.func.isRequired
  }),
  menuItems: PropTypes.arrayOf(ActionsMenuItemPropType),
  disableVoting: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  CommentLink: PropTypes.elementType.isRequired,
  Link: PropTypes.elementType.isRequired,
  focusHref: PropTypes.string.isRequired,
  profileHref: PropTypes.string.isRequired
}
