import { CustomEditor, CustomElement, CustomText } from '../../../custom-types'
import {
  Text,
  Node,
  NodeEntry,
  Transforms,
  Editor,
  Element as SlateElement
} from 'slate'
import { KeyboardEvent } from 'react'
import { ReactEditor } from 'slate-react'

export const getTextNode = (
  nodeEntry: NodeEntry,
  editor: CustomEditor,
  hasContent = false,
  direction: 'next' | 'previous' = 'next'
): NodeEntry<CustomText> => {
  console.log('GET TEXT NODE')
  const [node, path] = nodeEntry
  if (Text.isText(node) && !node.end) {
    console.log('is text')
    if (hasContent && !node.text) {
      console.log('but is empty')
      const parent = Editor.parent(editor, nodeEntry[1])
      console.log('trying parent node')
      return getTextNode(parent, editor, hasContent, direction)
    }
    return [node as CustomText, path]
  } else {
    console.log('is block')
    let nearest: NodeEntry<CustomText>
    let distance = 100
    for (const [n, p] of Node.descendants(node)) {
      // console.log(n, p)
      // we want the shallowest child
      const newDistance = p.length
      if (
        Text.isText(n) &&
        !n.end &&
        (direction === 'next'
          ? newDistance <= distance
          : newDistance < distance) &&
        (n.text || !hasContent)
      ) {
        distance = newDistance
        nearest = [n, p]
      }
    }
    if (!nearest) {
      console.log('couldnt find nearest')
      const parent = Editor.parent(editor, nodeEntry[1])
      console.log('trying parent node')
      return getTextNode(parent, editor, hasContent, direction)
    }
    const nearestNode = nearest[0] as CustomText
    const nearestPath = path.concat(nearest[1])
    console.log('found:', [nearestNode, nearestPath])
    return [nearestNode, nearestPath]
  }
}

export const findRepeatNode = (
  editor: CustomEditor
): CustomElement | undefined => {
  let target: CustomElement
  for (const [n, p] of Editor.nodes(editor)) {
    if (SlateElement.isElement(n) && n.template?.repeat) {
      // console.log('node:', n, p)
      target = n
    }
  }
  return target
}

export const selectAdjacent = (
  editor: CustomEditor,
  direction: 'next' | 'previous' = 'next'
): void => {
  console.log('selection:', editor.selection, editor)
  const referencePath =
    direction === 'next'
      ? editor.selection.focus.path
      : editor.selection.anchor.path
  const findTarget = direction === 'next' ? Editor.after : Editor.before
  const target = findTarget(editor, referencePath, {
    distance: 1,
    unit: 'block',
    voids: false
  })
  if (target) {
    const [targetNode, targetPath] = Editor.node(editor, target)
    const text = getTextNode([targetNode, targetPath], editor, true, direction)
    if (text) {
      const [textNode, textPath] = text
      console.log('select:', textPath, editor)
      const range = Editor.range(editor, textPath)
      console.log('range', range)
      console.log('DOM node', ReactEditor.toDOMNode(editor, textNode))
      console.log('DOM point', ReactEditor.toDOMPoint(editor, range.focus))
      // allow empty text nodes
      // if text node is empty: fill it with the placeholder and select it
      Transforms.select(editor, textPath)
    }
  }
}

export const navigateOnTab = (
  editor: CustomEditor,
  event: KeyboardEvent<HTMLDivElement>
): void => {
  if (event.key === 'Tab') {
    event.preventDefault()
    selectAdjacent(editor, event.shiftKey ? 'previous' : 'next')
  }
}
