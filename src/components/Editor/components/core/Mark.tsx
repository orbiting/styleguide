import React, {
  Attributes,
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react'
import { Editor, Transforms } from 'slate'
import {
  ReactEditor,
  useEditor,
  useFocused,
  useSelected,
  useSlate
} from 'slate-react'
import { config, configKeys } from '../marks'
import { ToolbarButton } from './ui/Toolbar'
import { Placeholder } from './ui/Placeholder'
import { CustomEditor, CustomMarksType, CustomText } from '../../custom-types'
import { getTextNode } from './helpers/tree'
import { toTitle } from './helpers/text'
import set = Reflect.set

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
  const selected = useSelected()
  const editor = useSlate()
  const childrenRef = useRef<ReactElement>()
  childrenRef.current = children
  const editorRef = useRef<CustomEditor>()
  editorRef.current = editor

  useEffect(() => {
    /*console.log('select status change', {
      childrenProps: childrenRef.current.props,
      selected
    })*/
    const placeholderText = toTitle(childrenRef.current.props.parent.type)
    const isUntouched = !selected && leaf.text === placeholderText
    if (isUntouched) {
      console.log('revert to placeholder')
      const parentPath = ReactEditor.findPath(
        editorRef.current,
        childrenRef.current.props.parent
      )
      const parentNode = Editor.node(editorRef.current, parentPath)
      console.log(parentNode)
      const [textNode, textPath] = getTextNode(parentNode, editorRef.current)
      console.log({ textPath })
      Transforms.insertText(editorRef.current, '', { at: textPath })
    }
  }, [selected])

  configKeys
    .filter(mKey => leaf[mKey])
    .forEach(mKey => {
      const Component = config[mKey].Component
      children = <Component>{children}</Component>
    })
  return (
    <span {...attributes}>
      {(!leaf.text || leaf.text === ' ') && !leaf.end && (
        <Placeholder element={children.props.parent} />
      )}
      {children}
    </span>
  )
}
