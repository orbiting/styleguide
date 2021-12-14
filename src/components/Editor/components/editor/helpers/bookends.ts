import { CustomText, NormalizeFn } from '../../../custom-types'
import { Editor, Element as SlateElement, Transforms } from 'slate'

// Bookends are a special type of leaf nodes.
// Slate requires the first and last inline nodes to be text nodes.
// We use bookends to push the content from the auto-added last node
// into the previous node, or from the first node into the next one.
export const handleBookends: NormalizeFn<CustomText> = (
  [node, path],
  editor
) => {
  console.log('HANDLE BOOKENDS')
  const previous = Editor.previous(editor, { at: path })
  console.log({ previous })
  // TODO
  //  const next = Editor.next(editor, { at: path })
  if (previous && SlateElement.isElement(previous[0])) {
    Transforms.insertNodes(
      editor,
      { text: node.text },
      { at: previous[1].concat(previous[0].children.length) }
    )
    Transforms.select(editor, previous[1])
    Transforms.insertText(editor, '', { at: path })
  }
}
