import { css } from 'glamor'
import React from 'react'
import PropTypes from 'prop-types'
import { mUp } from '../../theme/mediaQueries'
import { serifBold17, serifBold19 } from '../Typography/styles'
import { Interaction } from '../Typography'
import { TeaserFeed } from '../TeaserFeed'
import colors from '../../theme/colors'
import ColorContext from '../Colors/ColorContext'
import { useColorContext } from '../Colors/useColorContext'

const DefaultLink = ({ children }) => children

const TeaserMyMagazine = ({
  latestSubscribedArticles,
  latestProgressOrBookmarkedArticles,
  ActionBar,
  Link = DefaultLink
}) => {
  const [colorScheme] = useColorContext()

  if (
    latestSubscribedArticles.length === 0 &&
    latestProgressOrBookmarkedArticles.length === 0
  ) {
    return null
  }

  return (
    <div {...css({ backgroundColor: colorScheme.primaryBg })}>
      <section {...css(styles.section)}>
        <div role='group' {...css(styles.row, styles.withHighlight)}>
          {latestProgressOrBookmarkedArticles.length !== 0 && (
            <div
              {...(latestSubscribedArticles.length !== 0
                ? styles.left
                : styles.center)}
            >
              <Interaction.H3>Weiterlesen</Interaction.H3>
              <br />
              {latestProgressOrBookmarkedArticles.map(document => {
                const { path, id } = document
                const { shortTitle } = document.meta

                return (
                  <div
                    {...styles.tile}
                    style={{ border: `1px solid ${colorScheme.text}` }}
                    key={id}
                  >
                    <Link href={path} passHref>
                      <a
                        {...styles.tileHeadline}
                        style={{ color: colorScheme.text }}
                      >
                        {shortTitle.substring(0, 130).trim()}
                        {shortTitle.length >= 130 && <>&nbsp;…</>}
                      </a>
                    </Link>
                    {ActionBar && (
                      <ActionBar mode='bookmark' document={document} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
          {latestSubscribedArticles.length !== 0 && (
            <div
              {...(latestProgressOrBookmarkedArticles.length !== 0
                ? styles.right
                : styles.center)}
            >
              <Interaction.H3>Neuste abonnierte Beiträge</Interaction.H3>
              <br />
              {latestSubscribedArticles.map(document => (
                <TeaserFeed
                  Link={Link}
                  color={colorScheme.text}
                  format={document.meta.format}
                  path={document.meta.path}
                  title={
                    document.meta.shortTitle
                      ? `${document.meta.shortTitle.substring(0, 140).trim()} ${
                          document.meta.shortTitle.length >= 140 ? '…' : ''
                        }`
                      : document.meta.title
                  }
                  credits={document.meta.credits}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

const styles = {
  section: css({
    margin: '0 auto',
    maxWidth: 1300,
    padding: '40px 15px 10px',
    [mUp]: {
      padding: '50px 15px 40px'
    }
  }),
  row: css({
    display: 'flex',
    flexDirection: 'column',
    [mUp]: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }
  }),
  left: css({
    marginBottom: 32,
    [mUp]: {
      flexGrow: 1,
      marginRight: 16,
      marginBottom: 0
    }
  }),
  right: css({
    [mUp]: {
      flexGrow: 1,
      marginLeft: 16
    }
  }),
  center: css({
    marginBottom: 0,
    [mUp]: {
      width: '50%',
      marginBottom: 0
    }
  }),
  tile: css({
    padding: '16px 8px 12px 8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    ':last-child': {
      marginBottom: 30,
      [mUp]: {
        marginBottom: 40
      }
    },
    [mUp]: {
      padding: '12px 8px'
    }
  }),
  tileHeadline: css({
    textDecoration: 'none',
    cursor: 'pointer',
    wordWrap: 'break-word',
    width: '100%',
    ...serifBold17,
    lineHeight: '18px',
    [mUp]: {
      ...serifBold19,
      lineHeight: '21px'
    }
  })
}

const WrappedTeaserMyMagazine = props => (
  <ColorContext.Provider value={colors.negative}>
    <TeaserMyMagazine {...props} />
  </ColorContext.Provider>
)

export default WrappedTeaserMyMagazine

TeaserMyMagazine.propTypes = {
  latestSubscribedArticles: PropTypes.array,
  latestProgressOrBookmarkedArticles: PropTypes.array
}

WrappedTeaserMyMagazine.data = {
  config: {
    options: ({ first = 2 }) => ({
      variables: {
        first: +first
      }
    }),
    props: ({ data }) => {
      return {
        data: {
          loading: data.loading,
          error: data.error,
          latestSubscribedArticles: data.documents?.nodes.map(i => i.entity),
          latestProgressOrBookmarkedArticles: data.me?.bookmarkAndProgress.filter(
            i => i.document
          )
        }
      }
    }
  },
  query: `
  query getMyMagazineDocuments {
    documents: search(
      filters: [
          { key: "template", not: true, value: "section" }
          { key: "template", not: true, value: "format" }
          { key: "template", not: true, value: "front" }
        ]
        filter: { feed: true }
        sort: { key: publishedAt, direction: DESC }
        first: 2
      ) {
        nodes {
          entity {
            ... on Document {
              id
              meta {
                shortTitle
                title
                credits
                format {
                  meta {
                    title
                    kind
                    template
                    path
                  }
                }
              }
            }
          }
        }
      }
    me {
      bookmarkAndProgress: collectionItems(names: ["progress", "bookmarks"], first: 2) {
        nodes {
          document {
            id
            meta {
              publishDate
              shortTitle
              title
              path
              credits
            }
            userProgress {
              id
              percentage
            }
          }
        }
      }
    }
  }
  `
}