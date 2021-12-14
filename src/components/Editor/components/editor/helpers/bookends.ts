import { CustomText, NormalizeFn } from '../../../custom-types'
import { Editor, Transforms, Text } from 'slate'

// Bookends are a special type of leaf nodes.
// Slate requires the first and last inline nodes to be text nodes.
// We use bookends to push the content from the auto-added last node
// into the previous node, or from the first node into the next one.
export const handleBookends: NormalizeFn<CustomText> = (
  [node, path],
  editor
) => {
  if (!node.bookend) {
    return
  }
  console.log('HANDLE BOOKENDS')
  // Since the bookend nodes are at one end of the structure,
  // only previous or next will be defined.
  const previous = Editor.previous(editor, { at: path })
  if (previous) {
    const [prevNode, prevPath] = previous
    if (!Text.isText(prevNode)) return
    const text = prevNode.text.concat(node.text)
    if (node.text) {
      Transforms.insertText(editor, text, { at: prevPath })
    }
    Transforms.insertText(editor, '', { at: path })
    Transforms.select(editor, prevPath)
  }
}
