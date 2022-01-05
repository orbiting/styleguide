import { CustomEditor, CustomText, NormalizeFn } from '../../../custom-types'
import { Editor, Element as SlateElement, NodeEntry, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

const toTitle = (text = ''): string =>
  text.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())

export const selectPlaceholder = (
  editor: CustomEditor,
  node: NodeEntry<CustomText>
): void => {
  const [textNode, textPath] = node
  // this is a hack so that the element is selected before the text change
  // (selecting empty text nodes is a problem)
  Transforms.insertText(editor, ' ', { at: textPath })
  ReactEditor.focus(editor)
  Transforms.select(editor, textPath)
  setTimeout(() => {
    Transforms.insertText(editor, textNode.placeholder, { at: textPath })
    Transforms.select(editor, textPath)
  }, 0)
}

export const handlePlaceholders: NormalizeFn<CustomText> = (
  [node, path],
  editor
) => {
  if (node.end || path[path.length - 1] !== 0) {
    return
  }
  const parent = Editor.parent(editor, path)
  const [parentNode, parentPath] = parent
  if (!SlateElement.isElement(parentNode)) {
    return
  }
  const newProperties: Partial<CustomText> = {
    placeholder: toTitle(parentNode.type)
  }
  Transforms.setNodes(editor, newProperties, { at: path })
}
