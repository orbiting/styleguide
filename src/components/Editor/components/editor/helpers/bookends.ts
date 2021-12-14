import { CustomText, NormalizeFn } from '../../../custom-types'
import { Editor, Transforms, Text, Node } from 'slate'

// Bookends are a special type of leaf nodes.
// Slate requires the first and last inline nodes to be text nodes.
// We use bookends to push the content from the auto-added last node
// into the previous node, or from the first node into the next one.
export const handleBookends: NormalizeFn<CustomText> = (
  [node, path],
  editor
) => {
  //console.log('***', node)
  if (!node.bookend || !node.text) {
    return
  }
  //console.log('HANDLE BOOKENDS')
  // Since the bookend nodes are at one end of the structure,
  // only previous or next will be defined.
  // TODO: same with next (no use case atm)
  const previous = Editor.previous(editor, { at: path })
  if (previous) {
    const [prevNode, prevPath] = previous
    let nearestTextNode: CustomText
    let nearestTextPath: number[]
    if (Text.isText(prevNode)) {
      nearestTextNode = prevNode
      nearestTextPath = prevPath
    } else {
      const nearestText = Node.descendants(prevNode, {
        reverse: true,
        pass: node => Text.isText(node)
      }).next().value
      nearestTextNode = nearestText[0] as CustomText
      nearestTextPath = prevPath.concat(nearestText[1])
    }
    const text = nearestTextNode.text.concat(node.text)
    Transforms.insertText(editor, text, { at: nearestTextPath })
    Transforms.select(editor, nearestTextPath)
    Transforms.insertText(editor, '', { at: path })
  }
}
