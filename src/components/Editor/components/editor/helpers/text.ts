import { CustomEditor, CustomText, NormalizeFn } from '../../../custom-types'
import { Editor, Element as SlateElement, NodeEntry, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { config as elConfig } from '../../elements'

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
  // console.log('PLACEHOLDER', [node, path])
  const parent = Editor.parent(editor, path)
  const [parentNode, parentPath] = parent
  if (
    node.end ||
    path[path.length - 1] !== 0 ||
    !SlateElement.isElement(parentNode) ||
    (elConfig[parentNode.type].attrs &&
      elConfig[parentNode.type].attrs.skipPlaceholder)
  ) {
    if (node.placeholder) {
      const newProperties: Partial<CustomText> = {
        placeholder: undefined
      }
      Transforms.setNodes(editor, newProperties, { at: path })
    }
  } else if (!node.placeholder) {
    const newProperties: Partial<CustomText> = {
      placeholder: toTitle(parentNode.type)
    }
    Transforms.setNodes(editor, newProperties, { at: path })
  }
}
