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
import { selectPlaceholder } from './text'

export const getTextNode = (
  nodeEntry: NodeEntry,
  editor: CustomEditor,
  direction: 'next' | 'previous' = 'next'
): NodeEntry<CustomText> => {
  // console.log('GET TEXT NODE')
  const [node, path] = nodeEntry
  if (Text.isText(node) && !node.end) {
    // console.log('is text')
    return [node as CustomText, path]
  } else {
    // console.log('is block')
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
          : newDistance < distance)
      ) {
        distance = newDistance
        nearest = [n, p]
      }
    }
    if (!nearest && path !== []) {
      // console.log('couldnt find nearest')
      const parent = Editor.parent(editor, path)
      // console.log('trying parent node')
      return getTextNode(parent, editor, direction)
    }
    const nearestNode = nearest[0] as CustomText
    const nearestPath = path.concat(nearest[1])
    // console.log('found:', [nearestNode, nearestPath])
    return [nearestNode, nearestPath]
  }
}

export const findRepeatNode = (
  editor: CustomEditor
): CustomElement | undefined => {
  let target: CustomElement
  for (const [n, p] of Editor.nodes(editor)) {
    if (SlateElement.isElement(n) && n.template?.repeat) {
      target = n
    }
  }
  return target
}

const selectText = (
  editor: CustomEditor,
  node: NodeEntry<CustomText>
): void => {
  const [textNode, textPath] = node
  if (!textNode.text) {
    selectPlaceholder(editor, node)
    return
  }
  Transforms.select(editor, textPath)
}

export const selectAdjacent = (
  editor: CustomEditor,
  direction: 'next' | 'previous' = 'next'
): void => {
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
    const text = getTextNode([targetNode, targetPath], editor, direction)
    selectText(editor, text)
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
