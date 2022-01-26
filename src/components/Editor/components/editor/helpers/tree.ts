import {
  CustomDescendant,
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
  editor: CustomEditor,
  at?: Path
): NodeEntry<CustomElement> | undefined => {
  // console.log('find repeat node')
  let target
  for (const [n, p] of Editor.nodes(editor, {
    match: SlateElement.isElement,
    at
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

const isUnselectable = (
  editor: CustomEditor,
  target: NodeEntry<CustomDescendant>
): boolean =>
  Editor.isVoid(editor, target[0]) || (Text.isText(target[0]) && target[0].end)

export const getSiblingNode = (
  editor: CustomEditor,
  direction: 'next' | 'previous' = 'next',
  node?: NodeEntry<CustomDescendant>
): NodeEntry<CustomDescendant> | undefined => {
  let currentNode = node
  if (!currentNode) {
    const lowLevelPath =
      direction === 'next'
        ? editor.selection.focus.path
        : editor.selection.anchor.path
    currentNode = Editor.node(editor, lowLevelPath) as NodeEntry<
      CustomDescendant
    >
  }
  const edgeOfNode = Editor.edges(editor, currentNode[1])[
    direction === 'next' ? 1 : 0
  ]
  const findTarget = direction === 'next' ? Editor.next : Editor.previous
  let target = findTarget(editor, {
    at: edgeOfNode
  })
  if (target && isUnselectable(editor, target)) {
    target = getSiblingNode(editor, direction, target)
  }
  return target
}

export const calculateSiblingPath = (
  path: number[],
  direction: 'next' | 'previous' = 'next'
): number[] => {
  const offset = direction === 'next' ? 1 : -1
  return path.map((p, i) => (i === path.length - 1 ? p + offset : p))
}

const getSiblingTextNode = (
  editor: CustomEditor,
  direction: 'next' | 'previous' = 'next'
): NodeEntry<CustomText> => {
  const node = getSiblingNode(editor, direction)
  if (node) {
    return getTextNode(node, editor, direction)
  }
}

export const getSelectedElement = (
  editor: CustomEditor
): NodeEntry<CustomElement> => {
  let selectedNode = Editor.node(editor, editor.selection, { edge: 'end' })
  while (!SlateElement.isElement(selectedNode[0])) {
    selectedNode = Editor.parent(editor, selectedNode[1])
  }
  return selectedNode as NodeEntry<CustomElement>
}

export const hasNextSibling = (
  editor: CustomEditor,
  isInline = false
): boolean => {
  const currentPath = Editor.path(editor, editor.selection.focus)
  const nextNode = getSiblingTextNode(editor)
  if (!nextNode) return
  const nextPath = nextNode[1]
  const depth = isInline ? currentPath.length - 1 : currentPath.length - 2
  // console.log('has next sibling?', { currentPath, nextPath })
  return currentPath.every((p, i) => i >= depth || p === nextPath[i])
}

export const selectNode = (
  editor: CustomEditor,
  target: BasePoint | Path,
  direction: 'next' | 'previous' = 'next'
): void => {
  const [targetNode, targetPath] = Editor.node(editor, target)
  const text = getTextNode([targetNode, targetPath], editor, direction)
  selectText(editor, text)
}

// BUG: from figureCaption, doesnt jump to figureByline if it's empty
export const selectAdjacent = (
  editor: CustomEditor,
  direction: 'next' | 'previous' = 'next'
): void => {
  const node = getSiblingNode(editor, direction)
  if (node) {
    selectNode(editor, node[1], direction)
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
