import React from 'react'
import ReactDOM from 'react-dom'
import {Catalog} from 'catalog'
import {simulations, speedy, css} from 'glamor'
import theme from './catalogTheme'
import './global.css'
import './catalogTheme.css'
import * as fontStyles from './components/Typography/styles'

import 'core-js/fn/array/from'
import 'core-js/fn/array/find'

import {fontFaces} from './theme/fonts';
import {createFormatter} from './lib/translate'

simulations(true)
// prevent speed in catalog
// - iframe rendering (e.g. responsive preview)
//   does not support insertRule
speedy(false)

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
      {name: 'Desktop large', width: 1045, height: 480},
      {name: 'Desktop small', width: 800, height: 480},
      {name: 'Mobile', width: 320, height: 480}
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
          },
          {
            path: '/z-index',
            title: 'z-index',
            src: require('./theme/zIndex.docs.md')
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
              AutosuggestField: require('./components/Form/AutosuggestField.js'),
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
                Inner: require('./components/Form/VirtualDropdown.js').Inner,
              }
            },
            src: require('./components/Form/docs.md')
          },
          {
            path: '/components/comment',
            title: 'Comment',
            imports: {
              Comment: require('./components/Comment/Comment'),
              CommentHeader: require('./components/Comment/CommentHeader'),
              CommentActions: require('./components/Comment/CommentActions')
            },
            src: require('./components/Comment/docs.md')
          },
          {
            path: '/components/comment-composer',
            title: 'CommentComposer',
            imports: {
              t,
              CommentComposer: require('./components/CommentComposer/CommentComposer'),
              CommentComposerHeader: require('./components/CommentComposer/CommentComposerHeader'),
              CommentComposerPlaceholder: require('./components/CommentComposer/CommentComposerPlaceholder'),
              CommentComposerError: require('./components/CommentComposer/CommentComposerError'),
            },
            src: require('./components/CommentComposer/docs.md')
          },
          {
            path: '/components/comment-teaser',
            title: 'CommentTeaser',
            imports: {t, ...require('./components/CommentTeaser/docs.imports')},
            src: require('./components/CommentTeaser/docs.md')
          },
          {
            path: '/components/comment-tree',
            title: 'CommentTree',
            imports: {t, ...require('./components/CommentTree/docs.imports')},
            src: require('./components/CommentTree/docs.md')
          },
          {
            path: '/components/overlay',
            title: 'Overlay',
            imports: {t, ...require('./components/Overlay/docs.imports')},
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
        ]
      },
      {
        title: 'Templates',
        pages: [
          {
            path: '/center',
            title: 'Center',
            imports: {
              Center: require('./components/Center'),
              Breakout: require('./components/Center').Breakout,
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
            path: '/pullquote',
            title: 'PullQuote',
            imports: {
              css,
              ...require('./components/Typography'),
              PullQuote: require('./components/PullQuote/PullQuote'),
              PullQuoteBody: require('./components/PullQuote/Body'),
              PullQuoteFigure: require('./components/PullQuote/Figure'),
              PullQuoteSource: require('./components/PullQuote/Source'),
              PullQuoteText: require('./components/PullQuote/Text'),
              Byline: require('./components/Figure/Byline'),
              Caption: require('./components/Figure/Caption'),
              Image: require('./components/Figure/Image'),
              Center: require('./components/Center'),
            },
            src: require('./components/PullQuote/docs.md')
          },
          {
            path: '/infobox',
            title: 'InfoBox',
            imports: {
              css,
              ...require('./components/Typography'),
              InfoBox: require('./components/InfoBox/InfoBox'),
              InfoBoxFigure: require('./components/InfoBox/Figure'),
              InfoBoxText: require('./components/InfoBox/Text'),
              InfoBoxTitle: require('./components/InfoBox/Title'),
              Byline: require('./components/Figure/Byline'),
              Caption: require('./components/Figure/Caption'),
              Image: require('./components/Figure/Image'),
              Center: require('./components/Center'),
            },
            src: require('./components/InfoBox/docs.md')
          },
          {
            path: '/socialembed',
            title: 'SocialEmbed',
            imports: {
              css,
              ...require('./components/Typography'),
              SocialEmbed: require('./components/Social/Embed'),
              Center: require('./components/Center'),
            },
            src: require('./components/Social/docs.md')
          },
          {
            path: '/figure',
            title: 'Figure',
            imports: {
              css,
              ...require('./components/Typography'),
              Figure: require('./components/Figure').Figure,
              FigureGroup: require('./components/Figure').FigureGroup,
              Byline: require('./components/Figure/Byline'),
              Caption: require('./components/Figure/Caption'),
              Image: require('./components/Figure/Image'),
            },
            src: require('./components/Figure/docs.md')
          },
           {
            path: '/teaser',
            title: 'Teaser',
            imports: {
              css,
              ...require('./components/Typography'),
              ...require('./components/Teaser'),
              Center: require('./components/Center')
            },
            src: require('./components/Teaser/docs.md')
          },
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
                {key: 'styleguide/Hello/generic', value: 'Hallo!'},
                {key: 'styleguide/Hello/greetings', value: 'Hallo {name}'},
                {key: 'styleguide/Hello/greetings/Thomas', value: 'Hoi Thomas'},
                {key: 'styleguide/Hello/message/0', value: 'Sie waren noch nie hier'},
                {key: 'styleguide/Hello/message/1', value: 'Willkommen an Bord {name}!'},
                {key: 'styleguide/Hello/message/2', value: 'Schön Sie wieder zu sehen!'},
                {key: 'styleguide/Hello/message/other', value: 'Willkommen zum {count}. Mal {name}!'},
                {key: 'styleguide/Hello/label/visits', value: 'Anzahl Besuche'},
                {key: 'styleguide/Hello/label/name', value: 'Name'},
              ])
            }
          }
        ]
      },
    ]}
  />,
  document.getElementById('root')
);
