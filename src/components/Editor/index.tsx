import React from 'react'
import {
  CustomDescendant,
  CustomElement,
  CustomText,
  NodeTemplate
} from './custom-types'
import Forms from './components/editor/ui/Forms'
import SlateEditor from './components/editor'
import { config as elConfig } from './components/elements'
import { Element as SlateElement } from 'slate'

const needsData = (value: (CustomElement | CustomText)[]): boolean =>
  value.some(
    node =>
      SlateElement.isElement(node) &&
      ((elConfig[node.type].dataRequired || []).some(
        requiredKey => !node[requiredKey]
      ) ||
        needsData(node.children))
  )

const Editor: React.FC<{
  value: CustomDescendant[]
  setValue: (t: CustomDescendant[]) => void
  structure?: NodeTemplate[]
}> = ({ value, setValue, structure }) =>
  needsData(value) ? (
    <Forms value={value} setValue={setValue} />
  ) : (
    <SlateEditor value={value} setValue={setValue} structure={structure} />
  )

export default Editor
