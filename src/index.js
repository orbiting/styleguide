import React from 'react'
import ReactDOM from 'react-dom'
import { Catalog, ReactSpecimen } from 'catalog'
import { simulations, speedy, css } from 'glamor'
import theme from './catalogTheme'
import './global.css'
import './catalogTheme.css'
import * as fontStyles from './components/Typography/styles'

import 'core-js/fn/array/from'
import 'core-js/fn/array/find'
import 'core-js/es6'

import { fontFaces } from './theme/fonts'
import { createFormatter } from './lib/translate'

simulations(true)
// prevent speedy in catalog
// - iframe rendering (e.g. responsive preview)
//   does not support insertRule
speedy(false)

// we want react code by default :)
ReactSpecimen.defaultProps = {
  ...ReactSpecimen.defaultProps,
  showSource: true
}

require('glamor/reset')

const styleTag = document.createElement('style')
styleTag.innerHTML = fontFaces()
document.body.appendChild(styleTag)

const t = createFormatter(
  require('./lib/translations.json').data
)

ReactDOM.render(
  <Catalog
    title='Style Guide'
    theme={theme}
    useBrowserHistory
    responsiveSizes={[
      { name: 'Desktop large', width: 1095, height: 800 },
      { name: 'Desktop small', width: 800, height: 600 },
      { name: 'Mobile', width: 320, height: 480 }
    ]}
    pages={[
      {
        path: '/',
        title: 'Overview',
        src: require('./README.md')
      },
      {
        title: 'Base',
        pages: [
          {
            path: '/logo',
            title: 'Logo',
            imports: {
              Logo: require('./components/Logo'),
              BrandMark: require('./components/Logo/BrandMark')
            },
            src: require('./components/Logo/docs.md')
          },
          {
            path: '/typography',
            title: 'Typography',
            imports: {
              ...require('./components/Typography'),
              css,
              styles: JSON.parse(JSON.stringify(fontStyles)),
              fontFamilies: require('./theme/fonts').fontFamilies
            },
            src: require('./components/Typography/docs.md')
          },
          {
            path: '/colors',
            title: 'Colors',
            component: require('./theme/colors.docs.js')
          },
          {
            path: '/grid',
            title: 'Grid',
            imports: require('./components/Grid'),
            src: require('./components/Grid/docs.md')
          }
        ]
      },
      {
        title: 'Components',
        pages: [
          {
            path: '/components/spinner',
            title: 'Spinner',
            imports: {
              Spinner: require('./components/Spinner'),
              InlineSpinner: require('./components/Spinner').InlineSpinner
            },
            src: require('./components/Spinner/docs.md')
          },
          {
            path: '/components/loader',
            title: 'Loader',
            imports: {
              ...require('./components/Typography'),
              Loader: require('./components/Loader'),
              Spinner: require('./components/Spinner'),
              NarrowContainer: require('./components/Grid').NarrowContainer
            },
            src: require('./components/Loader/docs.md')
          },
          {
            path: '/components/button',
            title: 'Button',
            imports: {
              Button: require('./components/Button')
            },
            src: require('./components/Button/docs.md')
          },
          {
            path: '/format',
            title: 'FormatTag',
            imports: {
              ...require('./components/Format')
            },
            src: require('./components/Format/docs.md')
          },
          {
            path: '/forms',
            title: 'Forms',
            imports: {
              css,
              ...require('./components/Typography'),
              Button: require('./components/Button'),
              Checkbox: require('./components/Form/Checkbox.js'),
              Radio: require('./components/Form/Radio.js'),
              Field: require('./components/Form/Field.js'),
              FieldSet: require('./components/Form/FieldSet.js'),
              Autocomplete: require('./components/Form/Autocomplete.js'),
              MaskedInput: require('react-maskedinput'),
              AutosizeInput: require('react-textarea-autosize'),
              Dropdown: require('./components/Form/Dropdown.js'),
              VirtualDropdown: require('./components/Form/VirtualDropdown.js'),
              NativeDropdown: require('./components/Form/NativeDropdown.js'),
              dropdownItems: [
                { value: '1', text: 'Redaktorin' },
                { value: '2', text: 'Fussballerin' },
                { value: '3', text: 'Pizzaliebhaberin' }
              ],
              VirtualDropdownInternal: {
                Items: require('./components/Form/VirtualDropdown.js').Items,
                ItemsContainer: require('./components/Form/VirtualDropdown.js').ItemsContainer,
                Inner: require('./components/Form/VirtualDropdown.js').Inner
              },
              SearchIcon: require('react-icons/lib/md/search')
            },
            src: require('./components/Form/docs.md')
          },
          {
            path: '/components/overlay',
            title: 'Overlay',
            imports: { t, ...require('./components/Overlay/docs.imports') },
            src: require('./components/Overlay/docs.md')
          },
          {
            path: '/components/raw-html',
            title: 'RawHtml',
            imports: {
              ...require('./components/Typography'),
              RawHtml: require('./components/RawHtml')
            },
            src: require('./components/RawHtml/docs.md')
          },
          {
            path: '/videoplayer',
            title: 'VideoPlayer',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/VideoPlayer'),
              Center: require('./components/Center')
            },
            src: require('./components/VideoPlayer/docs.md')
          },
          {
            path: '/audioplayer',
            title: 'AudioPlayer',
            imports: {
              t,
              css,
              ...require('./components/Typography'),
              ...require('./components/AudioPlayer'),
              Center: require('./components/Center')
            },
            src: require('./components/AudioPlayer/docs.md')
          },
          {
            path: '/lazyload',
            title: 'LazyLoad',
            imports: {
              ...require('./components/Typography').Interaction,
              LazyLoad: require('./components/LazyLoad'),
              LazyImage: require('./components/LazyLoad/Image')
            },
            src: require('./components/LazyLoad/docs.md')
          },
          {
            path: '/gallery',
            title: 'Gallery',
            imports: {
              css,
              ...require('./components/Gallery'),
              ...require('./components/Figure'),
            },
            src: require('./components/Gallery/docs.md')
          }
        ]
      },
      {
        title: 'Comments',
        pages: [
          {
            path: '/components/comment',
            title: 'Comment',
            imports: {
              t,
              ...require('./components/Typography'),
              exampleMdast: require('./components/Comment/exampleMdast').exampleMdast,
              isoString: (new Date()).toString(),
              Comment: require('./components/Comment/Comment'),
              CommentHeader: require('./components/Comment/CommentHeader'),
              CommentContext: require('./components/Comment/CommentContext'),
              CommentActions: require('./components/Comment/CommentActions')
            },
            src: require('./components/Comment/docs.md')
          },
          {
            path: '/components/commentcomposer',
            title: 'Composer',
            imports: {
              t,
              CommentComposer: require('./components/CommentComposer/CommentComposer'),
              CommentComposerHeader: require('./components/CommentComposer/CommentComposerHeader'),
              CommentComposerPlaceholder: require('./components/CommentComposer/CommentComposerPlaceholder'),
              CommentComposerError: require('./components/CommentComposer/CommentComposerError')
            },
            src: require('./components/CommentComposer/docs.md')
          },
          {
            path: '/components/commentteaser',
            title: 'Teaser',
            imports: {
              t,
              ...require('./components/CommentTeaser/docs.imports')
            },
            src: require('./components/CommentTeaser/docs.md')
          },
          {
            path: '/components/commenttree',
            title: 'Tree',
            imports: { t, ...require('./components/CommentTree/docs.imports') },
            src: require('./components/CommentTree/docs.md')
          }
        ]
      },
      {
        title: 'Article Elements',
        pages: [
          {
            path: '/center',
            title: 'Center',
            imports: {
              Center: require('./components/Center'),
              Breakout: require('./components/Center').Breakout
            },
            src: require('./components/Center/docs.md')
          },
          {
            path: '/titleblock',
            title: 'TitleBlock',
            imports: {
              css,
              ...require('./components/Typography'),
              TitleBlock: require('./components/TitleBlock')
            },
            src: require('./components/TitleBlock/docs.md')
          },
          {
            path: '/blockquote',
            title: 'BlockQuote',
            imports: {
              css,
              ...require('./components/BlockQuote'),
              ...require('./components/Typography'),
              ...require('./components/Figure')
            },
            src: require('./components/BlockQuote/docs.md')
          },
          {
            path: '/pullquote',
            title: 'PullQuote',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/PullQuote'),
              ...require('./components/Figure'),
              Center: require('./components/Center')
            },
            src: require('./components/PullQuote/docs.md')
          },
          {
            path: '/infobox',
            title: 'InfoBox',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/InfoBox'),
              ...require('./components/Figure'),
              Center: require('./components/Center')
            },
            src: require('./components/InfoBox/docs.md')
          },
          {
            path: '/tweet',
            title: 'Tweet',
            imports: {
              css,
              ...require('./components/Typography'),
              Tweet: require('./components/Social/Tweet'),
              Center: require('./components/Center')
            },
            src: require('./components/Social/docs.md')
          },
          {
            path: '/video',
            title: 'Video',
            imports: {
              t,
              css,
              ...require('./components/Typography'),
              ...require('./components/Video'),
              Center: require('./components/Center')
            },
            src: require('./components/Video/docs.md')
          },
          {
            path: '/figure',
            title: 'Figure',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/Figure'),
              Center: require('./components/Center')
            },
            src: require('./components/Figure/docs.md')
          },
          {
            path: '/list',
            title: 'List',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/List'),
              Center: require('./components/Center')
            },
            src: require('./components/List/docs.md')
          },
          {
            path: '/dossier',
            title: 'Dossier',
            imports: {
              css,
              t,
              ...require('./components/Typography'),
              ...require('./components/Dossier'),
              ...require('./components/TeaserFront'),
              ...require('./components/Figure')
            },
            src: require('./components/Dossier/docs.md')
          },
          {
            path: '/illustration-html',
            title: 'IllustrationHtml',
            imports: {
              IllustrationHtml: require('./components/IllustrationHtml')
            },
            src: require('./components/IllustrationHtml/docs.md')
          },
          {
            path: '/dynamic-component',
            title: 'DynamicComponent',
            imports: {
              DynamicComponent: require('./components/DynamicComponent')
            },
            src: require('./components/DynamicComponent/docs.md')
          }
        ]
      },
      {
        title: 'Teasers',
        pages: [
          {
            path: '/teaserfeed',
            title: 'Feed',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/TeaserFeed'),
              Center: require('./components/Center')
            },
            src: require('./components/TeaserFeed/docs.md')
          },
          {
            path: '/teaserfrontimage',
            title: 'FrontImage',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/TeaserFront'),
              Image: require('./components/Figure/Image')
            },
            src: require('./components/TeaserFront/Image.md')
          },
          {
            path: '/teaserfronttypo',
            title: 'FrontTypo',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/TeaserFront')
            },
            src: require('./components/TeaserFront/Typo.md')
          },
          {
            path: '/teaserfrontsplit',
            title: 'FrontSplit',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/TeaserFront'),
              Image: require('./components/Figure/Image')
            },
            src: require('./components/TeaserFront/Split.md')
          },
          {
            path: '/teaserfronttile',
            title: 'FrontTile',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/TeaserFront'),
              Image: require('./components/Figure/Image')
            },
            src: require('./components/TeaserFront/Tile.md')
          },
          {
            path: '/teaserfrontdossier',
            title: 'FrontDossier',
            imports: {
              css,
              t,
              ...require('./components/Typography'),
              ...require('./components/Dossier'),
              ...require('./components/TeaserFront'),
              ...require('./components/Figure')
            },
            src: require('./components/Dossier/Teaser.md')
          }
        ]
      },
      {
        title: 'Templates',
        pages: [
          {
            path: '/templates/article',
            title: 'Article',
            imports: {
              schema: require('./templates/Article').default(),
              ...require('./templates/docs'),
              renderMdast: require('mdast-react-render').renderMdast
            },
            src: require('./templates/Article/docs.md')
          },
          {
            path: '/templates/discussion',
            title: 'Discussion',
            imports: {
              schema: require('./templates/Discussion').default(),
              ...require('./templates/docs'),
              renderMdast: require('mdast-react-render').renderMdast
            },
            src: require('./templates/Discussion/docs.md')
          },
          {
            path: '/templates/comment',
            title: 'Comment',
            imports: {
              webSchema: require('./templates/Comment/web').default(),
              emailSchema: require('./templates/Comment/email').default(),
              ...require('./templates/docs'),
              renderMdast: require('mdast-react-render').renderMdast,
              CommentBody: require('./components/Comment/Comment').CommentBody
            },
            src: require('./templates/Comment/docs.md')
          },
          {
            path: '/templates/format',
            title: 'Format',
            imports: {
              schema: require('./templates/Format').default(),
              ...require('./templates/docs'),
              renderMdast: require('mdast-react-render').renderMdast
            },
            src: require('./templates/Format/docs.md')
          },
          {
            path: '/templates/dossier',
            title: 'Dossier',
            imports: {
              schema: require('./templates/Dossier').default(),
              ...require('./templates/docs'),
              renderMdast: require('mdast-react-render').renderMdast
            },
            src: require('./templates/Dossier/docs.md')
          },
          {
            path: '/templates/front',
            title: 'Front',
            imports: {
              schema: require('./templates/Front').default(),
              ...require('./templates/docs'),
              renderMdast: require('mdast-react-render').renderMdast
            },
            src: require('./templates/Front/docs.md')
          },
          {
            path: '/templates/editorialnewsletter',
            title: 'Newsletter',
            imports: {
              webSchema: require('./templates/EditorialNewsletter/web').default(),
              emailSchema: require('./templates/EditorialNewsletter/email').default(),
              ...require('./templates/docs'),
              renderMdast: require('mdast-react-render').renderMdast
            },
            src: require('./templates/EditorialNewsletter/docs.md')
          }
        ]
      },
      {
        title: 'Charts',
        pages: [
          {
            path: '/charts',
            title: 'Overview',
            component: require('./components/Chart/docs.js').default
          },
          {
            path: '/charts/bars',
            title: 'Bars',
            imports: {
              ...require('./components/Typography'),
              ChartTitle: require('./components/Chart').ChartTitle,
              ChartLead: require('./components/Chart').ChartLead,
              CsvChart: require('./components/Chart/Csv'),
              t
            },
            src: require('./components/Chart/Bars.docs.md')
          },
          {
            path: '/charts/timebars',
            title: 'Time Bars',
            imports: {
              ...require('./components/Typography'),
              ChartTitle: require('./components/Chart').ChartTitle,
              ChartLead: require('./components/Chart').ChartLead,
              CsvChart: require('./components/Chart/Csv'),
              t
            },
            src: require('./components/Chart/TimeBars.docs.md')
          },
          {
            path: '/charts/lollipops',
            title: 'Lollipops',
            imports: {
              ...require('./components/Typography'),
              ChartTitle: require('./components/Chart').ChartTitle,
              ChartLead: require('./components/Chart').ChartLead,
              CsvChart: require('./components/Chart/Csv'),
              t
            },
            src: require('./components/Chart/Lollipops.docs.md')
          },
          {
            path: '/charts/lines',
            title: 'Lines',
            imports: {
              ...require('./components/Typography'),
              ChartTitle: require('./components/Chart').ChartTitle,
              ChartLead: require('./components/Chart').ChartLead,
              CsvChart: require('./components/Chart/Csv'),
              t
            },
            src: require('./components/Chart/Lines.docs.md')
          },
          {
            path: '/charts/slopes',
            title: 'Slopes',
            imports: {
              ...require('./components/Typography'),
              ChartTitle: require('./components/Chart').ChartTitle,
              ChartLead: require('./components/Chart').ChartLead,
              CsvChart: require('./components/Chart/Csv'),
              t
            },
            src: require('./components/Chart/Slopes.docs.md')
          },
          {
            path: '/charts/scatterplots',
            title: 'Scatter Plots',
            imports: {
              ...require('./components/Typography'),
              ChartTitle: require('./components/Chart').ChartTitle,
              ChartLead: require('./components/Chart').ChartLead,
              CsvChart: require('./components/Chart/Csv'),
              t
            },
            src: require('./components/Chart/ScatterPlots.docs.md')
          }
        ]
      },
      {
        title: 'Development',
        pages: [
          {
            path: '/dev/process',
            title: 'Process',
            src: require('./development/process.docs.md')
          },
          {
            path: '/dev/translate',
            title: 'Translate',
            src: require('./lib/translate.docs.md'),
            imports: {
              Field: require('./components/Form/Field.js'),
              ...require('./components/Typography'),
              t: createFormatter([
                { key: 'styleguide/Hello/generic', value: 'Hallo!' },
                { key: 'styleguide/Hello/greetings', value: 'Hallo {name}' },
                { key: 'styleguide/Hello/greetings/Thomas', value: 'Hoi Thomas' },
                { key: 'styleguide/Hello/message/0', value: 'Sie waren noch nie hier' },
                { key: 'styleguide/Hello/message/1', value: 'Willkommen an Bord {name}!' },
                { key: 'styleguide/Hello/message/2', value: 'Schön Sie wieder zu sehen!' },
                { key: 'styleguide/Hello/message/other', value: 'Willkommen zum {count}. Mal {name}!' },
                { key: 'styleguide/Hello/label/visits', value: 'Anzahl Besuche' },
                { key: 'styleguide/Hello/label/name', value: 'Name' },
                { key: 'styleguide/Hello/html', value: 'Hallo<br />{link}' }
              ]),
              RawHtml: require('./components/RawHtml')
            }
          },
          {
            path: '/dev/slug',
            title: 'Slug',
            src: require('./lib/slug.docs.md')
          },
          {
            path: '/z-index',
            title: 'z-index',
            src: require('./theme/zIndex.docs.md')
          },
          {
            path: '/dev/inQuotes',
            title: 'inQuotes',
            src: require('./lib/inQuotes.docs.md'),
            imports: {
              ...require('./components/Typography'),
              ...require('./lib/inQuotes')
            }
          }
        ]
      }
    ]}
  />,
  document.getElementById('root')
)
