import { KeyboardEvent } from 'react'
import {
  CustomDescendant,
  CustomEditor,
  CustomElement,
  CustomElementsType,
  CustomText,
  KeyCombo,
  NodeTemplate,
  NormalizeFn,
  TemplateType
} from '../../../custom-types'
import { Editor, Element as SlateElement, Text, Transforms, Range } from 'slate'
import {
  calculateSiblingPath,
  findInsertTarget,
  getSelectedElement,
  getSiblingNode,
  hasNextSibling,
  selectAdjacent,
  selectNode
} from './tree'
import { config as elConfig } from '../../elements'
import { getCharCount } from './text'

const DEFAULT_STRUCTURE: NodeTemplate[] = [{ type: ['text'], repeat: true }]
const TEXT = { text: '' }

const isAllowedType = (
  elType: TemplateType,
  allowedTypes: TemplateType | TemplateType[]
): boolean =>
  Array.isArray(allowedTypes)
    ? allowedTypes.some(t => t === elType)
    : allowedTypes === elType

const isCorrect = (
  node: CustomDescendant | undefined,
  template: NodeTemplate | undefined
): boolean => {
  if (!node && !template) return true
  if (!node || !template) return false
  if (Text.isText(node))
    return isAllowedType('text', template.type) && node.end === template.end
  if (SlateElement.isElement(node))
    return isAllowedType(node.type, template.type)
}

const getTemplateType = (
  template?: NodeTemplate
): CustomElementsType | undefined => {
  if (!template) return
  const nodeType = Array.isArray(template.type)
    ? template.type[0]
    : template.type
  return nodeType !== 'text' ? nodeType : undefined
}

const buildTextNode = (isEnd: boolean): CustomText => {
  const end = isEnd ? { end: true } : {}
  return {
    ...TEXT,
    ...end
  }
}

export const buildElement = (
  elKey: CustomElementsType,
  children?: CustomDescendant[]
): CustomElement => ({
  type: elKey,
  children: children || [TEXT]
})

const buildFromTemplate = (
  template: NodeTemplate,
  children?: CustomDescendant[]
): CustomDescendant => {
  const nodeType = getTemplateType(template)
  return !nodeType
    ? buildTextNode(template.end)
    : buildElement(nodeType, children)
}

const shouldRemove = (
  currentNode: CustomDescendant | undefined,
  nextNode: CustomDescendant | undefined,
  currentTemplate: NodeTemplate | undefined,
  prevTemplate: NodeTemplate | undefined
) =>
  currentNode &&
  getCharCount([currentNode]) === 0 &&
  !isCorrect(currentNode, currentTemplate) &&
  (isCorrect(nextNode, currentTemplate) ||
    (prevTemplate?.repeat && isCorrect(nextNode, prevTemplate)))

const insertMissingNode = (
  node: CustomDescendant | undefined,
  path: number[],
  currentTemplate: NodeTemplate,
  nextTemplate: NodeTemplate | undefined,
  editor: CustomEditor
): void => {
  // console.log('FIX STRUCTURE')
  if (!node || isCorrect(node, nextTemplate)) {
    // console.log('insert new node')
    const newNode = buildFromTemplate(currentTemplate)
    return Transforms.insertNodes(editor, newNode, {
      at: path
    })
  }
  // console.log('convert current node')
  // TODO: what if the current node is an inline element
  //  and the template is a block?
  SlateElement.isElement(node) && Transforms.unwrapNodes(editor, { at: path })
  const wrapper = buildFromTemplate(currentTemplate, [])
  SlateElement.isElement(wrapper)
    ? Transforms.wrapNodes(editor, wrapper, { at: path })
    : Transforms.setNodes(editor, { end: currentTemplate.end }, { at: path })
}

// we probably don't need to relink every time
const linkTemplate = (
  path: number[],
  template: NodeTemplate,
  editor: CustomEditor
): void => {
  const newProperties: Partial<CustomElement> = {
    template
  }
  Transforms.setNodes(editor, newProperties, { at: path })
}

const deleteExcessChildren = (
  from: number,
  node: CustomElement,
  path: number[],
  editor: CustomEditor
): void => {
  // console.log('DELETE EXCESS', from, 'vs', node.children.length, node)
  for (let i = node.children.length - 1; i >= from; i--) {
    // console.log('delete', path.concat(i))
    // console.log(node.children[i])
    Transforms.removeNodes(editor, { at: path.concat(i) })
  }
}

const deleteParent = (
  editor: CustomEditor,
  currentTemplate: NodeTemplate
): boolean => {
  const elementType = getTemplateType(currentTemplate)
  const lastOp = editor.operations[editor.operations.length - 1]
  return (
    elementType &&
    lastOp &&
    lastOp.type === 'remove_node' &&
    SlateElement.isElement(lastOp.node) &&
    lastOp.node.type === elementType &&
    elConfig[elementType].attrs?.propagateDelete
  )
}

export const matchStructure: (
  structure?: NodeTemplate[]
) => NormalizeFn<CustomElement> = (structure = DEFAULT_STRUCTURE) => (
  [node, path],
  editor
) => {
  // console.log('MATCH STRUCTURE')
  let i = 0
  let repeatOffset = 0
  let loop = true
  while (loop) {
    const currentNode = node.children[i + repeatOffset]
    const nextNode =
      i + repeatOffset < node.children.length - 1 &&
      node.children[i + repeatOffset + 1]
    const currentPath = path.concat(i + repeatOffset)
    const currentTemplate = structure[i]
    const prevTemplate = i > 0 && structure[i - 1]
    const nextTemplate = i < structure.length - 1 && structure[i + 1]
    /*console.log({
      i,
      repeatOffset,
      currentNode,
      nextNode,
      currentTemplate,
      prevTemplate,
      nextTemplate
    })*/
    // TODO: min/max repeats
    if (prevTemplate?.repeat && isCorrect(currentNode, prevTemplate)) {
      // we use the template for switch between block types and onEnter insert
      linkTemplate(currentPath, prevTemplate, editor)
      repeatOffset += 1
    } else if (
      shouldRemove(currentNode, nextNode, currentTemplate, prevTemplate)
    ) {
      // this is here mostly to delete unwanted <br> elements
      return Transforms.removeNodes(editor, { at: currentPath })
    } else if (!currentTemplate) {
      loop = false
    } else if (isCorrect(currentNode, currentTemplate)) {
      linkTemplate(currentPath, currentTemplate, editor)
      i += 1
    } else if (deleteParent(editor, currentTemplate)) {
      return Transforms.removeNodes(editor, { at: path })
    } else {
      return insertMissingNode(
        currentNode,
        currentPath,
        currentTemplate,
        nextTemplate,
        editor
      )
    }
  }
  deleteExcessChildren(structure.length + repeatOffset, node, path, editor)
}

export const buildAndInsert = (
  editor: CustomEditor,
  elKey: CustomElementsType
): void => {
  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  // TODO: use commonAncestor to safeguard that element is valid
  //  (similar to toolbar getInline logic)
  const element = buildElement(elKey, !isCollapsed && [])
  // console.log('insert', element)
  if (isCollapsed) {
    Transforms.insertNodes(editor, element)
  } else {
    // TODO: review wrap/unwrap logic for inline vs block elements
    //  if selected element is block it makes sense to unwrap first
    Transforms.wrapNodes(editor, element, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

export const insertOnKey = (keyCombo: KeyCombo, elKey: CustomElementsType) => (
  editor: CustomEditor,
  event: KeyboardEvent<HTMLDivElement>
): void => {
  if (event.key === keyCombo.name && event.shiftKey === !!keyCombo.shift) {
    event.preventDefault()
    buildAndInsert(editor, elKey)
  }
}

// struct allows repeats?
//     |               |
//    YES              NO
// insert first        match last element is struct?
// type in struct      |               |
//                    NO              YES
//                  selectAdjacent    escalate to parent (if not root)
const insertRepeat = (editor: CustomEditor): void => {
  let target = findInsertTarget(editor)
  let nextTarget = false
  // look if the next sibling has a target
  if (!target) {
    const nextNode = getSiblingNode(editor)
    if (nextNode) {
      target = findInsertTarget(editor, nextNode[1])
      nextTarget = true
    }
  }
  // if insert doesn't make sense, we jump to the next element instead
  if (!target) {
    return selectAdjacent(editor)
  }
  const isInline = Editor.isInline(editor, target[0])
  const selectionP = getSelectedElement(editor)[1]
  const [targetN, targetP] = target
  if (
    selectionP.length !== targetP.length &&
    hasNextSibling(editor, isInline)
  ) {
    return selectAdjacent(editor)
  }
  let insertP
  Editor.withoutNormalizing(editor, () => {
    // split nodes at selection and move the second half of the split
    // in the first position where repeats are allowed
    Transforms.splitNodes(editor, { always: true })
    // since the node got split, splitP != selectionP
    const splitP = getSelectedElement(editor)[1]
    Transforms.setNodes(
      editor,
      { type: getTemplateType(targetN.template) },
      { at: splitP }
    )
    insertP = nextTarget ? targetP : calculateSiblingPath(targetP)
    Transforms.moveNodes(editor, { at: splitP, to: insertP })
  })
  selectNode(editor, insertP)
}

export const handleInsert = (
  editor: CustomEditor,
  event: KeyboardEvent<HTMLDivElement>
): void => {
  if (event.key === 'Enter' && event.shiftKey !== true) {
    event.preventDefault()
    insertRepeat(editor)
  }
}
