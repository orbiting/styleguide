import React from 'react'

import DynamicComponent from '../../components/DynamicComponent'
import ErrorBoundary from '../../components/ErrorBoundary'
import {
  Figure
} from '../../components/Figure'

import {
  matchZone
} from 'mdast-react-render/lib/utils'

const createDynamicComponent = ({t, dynamicComponentRequire, insertButtonText, externalComponents}) => ({
  matchMdast: matchZone('DYNAMIC_COMPONENT'),
  component: ({showException, raw = false, size, ...props}) => {
    const ExternalComponent =
      externalComponents &&
      externalComponents[props.src]

    const content = (
      <ErrorBoundary
        showException={showException}
        failureMessage={t('styleguide/DynamicComponent/error')}>
        {ExternalComponent
          ? <ExternalComponent size={size} {...props} />
          : <DynamicComponent size={size} {...props} />
        }
      </ErrorBoundary>
    )

    if (raw) {
      return content
    }

    return <Figure size={size}>
      {content}
    </Figure>
  },
  props: node => {
    const html = node.children.find(c => c.type === 'code' && c.lang === 'html')
    return {
      raw: node.data.raw,
      size: node.data.size,
      src: node.data.src,
      html: html && html.value,
      props: node.data.props,
      loader: node.data.loader,
      require: dynamicComponentRequire
    }
  },
  editorModule: 'dynamiccomponent',
  editorOptions: {
    insertTypes: [
      'PARAGRAPH'
    ],
    insertButtonText
  },
  isVoid: true
})

export default createDynamicComponent
