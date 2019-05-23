import React from 'react'

/**
 * The DiscussionContext wraps static details about a discussion and all
 * discussion-wide callbacks that are provided to all Comment components.
 */
export const DiscussionContext = React.createContext({
  /**
   * Admin users have elevated priviledges, they can for example unpublish
   * any comment.
   */
  isAdmin: false,

  /**
   * The Discussion object, straight from the GraphQL server.
   */
  discussion: {
    id: '00000000-0000-0000-0000-000000000000',

    title: 'Der Crowdfunding-Code gegen die Frankenstein-Monster-Strategie',

    /**
     * This controls whether long comments can be collapsed.
     */
    collapsable: true,

    /**
     * The display author is optional, only provided if the user is
     * logged in.
     */
    displayAuthor: {
      name: 'Anonym',
      profilePicture: '/static/profilePicture1.png'
    },

    /**
     * ISO 8601 string. If set then the user must wait until that time before
     * they can write another comment.
     */
    userWaitUntil: undefined
  },

  /**
   * The ID of the comment that should be highlighted. It is optional.
   */
  highlightedCommentId: '3.1',

  /**
   * All the actions the user can do. These functions correspond mostly
   * to GraphQL mutations, though some are implemented purely in the
   * client-side JavaScript code.
   */
  actions: {
    /**
     * Submit a new comment to the discussion. The parent comment can be null,
     * in which case a new top-level comment will be created. Otherwise it'll
     * be a reply to the given comment.
     */
    submitComment: (parent, text, tags) => Promise.resolve(),

    editComment: (comment, content, tags) => Promise.resolve(),
    upvoteComment: commentId => Promise.resolve(),
    downvoteComment: commentId => Promise.resolve(),
    unpublishComment: commentId => Promise.resolve(),
    shareComment: commentId => Promise.resolve(),

    /**
     * Fetch more comments at the end of the given CommentConnection.
     */
    fetchMoreComments: (parentId, after) => Promise.resolve()
  },

  /**
   * The current time, plus a function to format the given time.
   */
  clock: {
    now: Date.now(),

    /**
     * Format the given date relative to the current time. The date
     * can be in the future or past.
     */
    formatTimeRelative: date => '2h'
  },

  /**
   * When components need to create links to other parts of the website, they
   * can use these components.
   */
  links: {
    Profile: ({ displayAuthor, ...props }) => <React.Fragment {...props} />,
    Comment: ({ comment, ...props }) => <React.Fragment {...props} />
  }
})
