import React from 'react'
import ReactDOM from 'react-dom'
import { Catalog } from 'catalog'
import { simulations } from 'glamor'
import theme from './catalogTheme'
import './catalogTheme.css'

import 'core-js/fn/array/from'
import 'core-js/fn/array/find'

import { fontFaces } from './theme/fonts'

simulations(true)

const styleTag = document.createElement('style')
styleTag.innerHTML = fontFaces()
document.body.appendChild(styleTag)

ReactDOM.render(
  <Catalog
    title="Style Guide"
    theme={theme}
    useBrowserHistory
    responsiveSizes={[
      { name: 'Klein', width: 320, height: 480 },
      { name: 'Gross', width: 800, height: 480 }
    ]}
    pages={[
      {
        path: '/',
        title: 'Overview',
        src: require('../README.md')
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
              ...require('./components/Typography'),
              Button: require('./components/Button'),
              Checkbox: require('./components/Form/Checkbox.js'),
              Radio: require('./components/Form/Radio.js'),
              Field: require('./components/Form/Field.js'),
              AutosuggestField: require('./components/Form/AutosuggestField.js'),
              Select: require('./components/Form/Select.js'),
              MaskedInput: require('react-maskedinput')
            },
            src: require('./components/Form/docs.md')
          }
        ]
      }
    ]}
  />,
  document.getElementById('root')
)
