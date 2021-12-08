import React, { useState } from 'react'
import { CustomDescendant, CustomElement, CustomText } from './custom-types'
import Populate from './components/editor/ui/Forms'
import Editor from './components/editor'
import { config as elConfig } from './components/elements'
import { Element as SlateElement } from 'slate'

const needsData = (value: (CustomElement | CustomText)[]): boolean => {
  return value.some(
    node =>
      SlateElement.isElement(node) &&
      ((elConfig[node.type].dataRequired || []).some(
        requiredKey => !node[requiredKey]
      ) ||
        needsData(node.children))
  )
}

const EditorOverlay: React.FC<{
  value: CustomDescendant[]
  setValue: (t: CustomDescendant[]) => void
}> = () => {
  const [value, setValue] = useState<CustomDescendant[]>([])
  return needsData(value) ? (
    <Populate value={value} setValue={setValue} />
  ) : (
    <Editor value={value} setValue={setValue} />
  )
}

export default EditorOverlay
