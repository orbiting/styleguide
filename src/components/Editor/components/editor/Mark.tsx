import React, { Attributes, ReactElement, useEffect, useState } from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor, useFocused, useSlate } from 'slate-react'
import { config, configKeys } from '../marks'
import { ToolbarButton } from './ui/Toolbar'
import { Placeholder } from './ui/Placeholder'
import { CustomEditor, CustomMarksType, CustomText } from '../../custom-types'
import { getTextNode } from './helpers/tree'

const isMarkActive = (editor: CustomEditor, mKey: CustomMarksType): boolean => {
  const marks = Editor.marks(editor)
  return !!marks && !!marks[mKey]
}

const toggleMark = (editor: CustomEditor, mKey: CustomMarksType): void => {
  const isActive = isMarkActive(editor, mKey)
  if (isActive) {
    Editor.removeMark(editor, mKey)
  } else {
    Editor.addMark(editor, mKey, true)
  }
}

export const MarkButton: React.FC<{ mKey: CustomMarksType }> = ({ mKey }) => {
  const editor = useSlate()
  const mark = config[mKey]
  if (!mark.button) {
    return null
  }
  return (
    <ToolbarButton
      button={mark.button}
      disabled={!isMarkActive(editor, mKey)}
      onClick={() => toggleMark(editor, mKey)}
    />
  )
}

export const LeafComponent: React.FC<{
  attributes: Attributes
  children: ReactElement
  leaf: CustomText
}> = ({ attributes, children, leaf }) => {
  configKeys
    .filter(mKey => leaf[mKey])
    .forEach(mKey => {
      const Component = config[mKey].Component
      children = <Component>{children}</Component>
    })
  return (
    <span {...attributes}>
      {!leaf.text && !leaf.bookend && (
        <Placeholder element={children.props.parent} />
      )}
      {children}
    </span>
  )
}
