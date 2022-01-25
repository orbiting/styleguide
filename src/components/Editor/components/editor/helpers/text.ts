import { CustomEditor, CustomText, NormalizeFn } from '../../../custom-types'
import {
  Descendant,
  Editor,
  Element as SlateElement,
  Node,
  NodeEntry,
  Transforms
} from 'slate'
import { ReactEditor } from 'slate-react'
import { config as elConfig } from '../../elements'
import editorConfig from '../../../config'

export const CHAR_LIMIT = editorConfig.maxSigns

export const getCharCount = (nodes: (Descendant | Node)[]): number =>
  nodes.map(node => Node.string(node).length).reduce((a, b) => a + b, 0)

export const getCountDown = (editor: CustomEditor): number =>
  CHAR_LIMIT - getCharCount(editor.children)

export const toTitle = (text = ''): string =>
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
    Transforms.insertText(editor, textNode.placeholder || 'Text', {
      at: textPath
    })
    Transforms.select(editor, textPath)
  }, 0)
}

export const handlePlaceholders: NormalizeFn<CustomText> = (
  [node, path],
  editor
) => {
  // console.log('PLACEHOLDER', [node, path])
  const parent = Editor.parent(editor, path)
  const parentNode = parent[0]
  if (
    node.end ||
    path[path.length - 1] !== 0 ||
    !SlateElement.isElement(parentNode) ||
    elConfig[parentNode.type].attrs?.isVoid
  ) {
    if (node.placeholder) {
      const newProperties: Partial<CustomText> = {
        placeholder: undefined
      }
      Transforms.setNodes(editor, newProperties, { at: path })
    }
  } else {
    const placeholder = toTitle(parentNode.type)
    if (!node.placeholder || node.placeholder !== placeholder) {
      Transforms.setNodes(
        editor,
        {
          placeholder
        },
        { at: path }
      )
    }
  }
}
