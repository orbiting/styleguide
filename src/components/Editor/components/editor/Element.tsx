import React, { Attributes, ReactElement } from 'react'
import { Transforms } from 'slate'
import { useSlate } from 'slate-react'

import { config } from '../elements'
import { ToolbarButton } from './ui/Toolbar'
import { CustomElementsType } from '../../custom-types'

export const ContainerComponent: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ attributes, children }) => {
  return <div {...attributes}>{children}</div>
}

export const ElementButton: React.FC<{
  elKey: CustomElementsType
  disabled?: boolean
}> = ({ elKey, disabled }) => {
  const editor = useSlate()
  const element = config[elKey]
  if (!element?.button) {
    return null
  }
  return (
    <ToolbarButton
      button={element.button}
      disabled={disabled}
      onClick={() =>
        element.insert
          ? element.insert(editor)
          : element.node
          ? Transforms.insertNodes(editor, element.node)
          : console.warn(`Element ${elKey} missing insert/node definition`)
      }
    />
  )
}
