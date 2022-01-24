import {
  CustomEditor,
  CustomElement,
  CustomText
} from '../../../custom-types'
import {
  Text,
  Node,
  NodeEntry,
  Transforms,
  Editor,
  Element as SlateElement,
  BasePoint,
  Path
} from 'slate'
import { KeyboardEvent } from 'react'
import { selectPlaceholder } from './text'

// TODO: review with care. It does weird things with figure captions
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

export const findInsertTarget = (
  editor: CustomEditor
): NodeEntry<CustomElement> | undefined => {
  // console.log('find repeat node')
  let target
  for (const [n, p] of Editor.nodes(editor, {
    match: SlateElement.isElement
  })) {
    // console.log(n, p)
    if (n.template?.repeat) {
      target = [n, p]
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

const getNextPath = (
  editor: CustomEditor,
  direction: 'next' | 'previous' = 'next'
): BasePoint | undefined => {
  const referencePath =
    direction === 'next'
      ? editor.selection.focus.path
      : editor.selection.anchor.path
  const findTarget = direction === 'next' ? Editor.after : Editor.before
  return findTarget(editor, referencePath, {
    distance: 1,
    unit: 'block',
    voids: false
  })
}

export const calculateSiblingPath = (path: number[]): number[] =>
  path.map((p, i) => (i === path.length - 1 ? p + 1 : p))

export const selectNode = (
  editor: CustomEditor,
  target: BasePoint | Path,
  direction: 'next' | 'previous' = 'next'
): void => {
  if (target) {
    const [targetNode, targetPath] = Editor.node(editor, target)
    const text = getTextNode([targetNode, targetPath], editor, direction)
    selectText(editor, text)
  }
}

// BUG: from figureCaption, doesnt jump to figureByline if it's empty
export const selectAdjacent = (
  editor: CustomEditor,
  direction: 'next' | 'previous' = 'next'
): void => {
  const targetPoint = getNextPath(editor, direction)
  selectNode(editor, targetPoint, direction)
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
