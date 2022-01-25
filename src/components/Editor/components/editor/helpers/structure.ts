import { KeyboardEvent } from 'react'
import {
  CustomDescendant,
  CustomEditor,
  CustomElement,
  CustomElementsType,
  CustomText,
  NodeTemplate,
  NormalizeFn,
  TemplateType
} from '../../../custom-types'
import {
  Editor,
  Element as SlateElement,
  NodeEntry,
  Text,
  Transforms,
  Node
} from 'slate'
import {
  calculateSiblingPath,
  findInsertTarget,
  selectAdjacent,
  selectNode
} from './tree'
import { config as elConfig } from '../../elements'

const DEFAULT_STRUCTURE: NodeTemplate[] = [{ type: ['text'], repeat: true }]
const TEXT = { text: '' }

const isAllowedType = (
  elType: TemplateType,
  allowedTypes: TemplateType | TemplateType[]
): boolean =>
  Array.isArray(allowedTypes)
    ? allowedTypes.some(t => t === elType)
    : allowedTypes === elType

const isCorrect = (node: CustomDescendant, template: NodeTemplate): boolean =>
  (Text.isText(node) &&
    isAllowedType('text', template.type) &&
    node.end === template.end) ||
  (SlateElement.isElement(node) && isAllowedType(node.type, template.type))

const getTemplateType = (
  template?: NodeTemplate
): CustomElementsType | undefined => {
  if (!template) return
  const nodeType = Array.isArray(template.type)
    ? template.type[0]
    : template.type
  return nodeType !== 'text' ? nodeType : undefined
}

const buildTextNode = (template: NodeTemplate): CustomText => {
  const end = template.end ? { end: true } : {}
  return {
    ...TEXT,
    ...end
  }
}

const buildNode = (
  template: NodeTemplate,
  children?: CustomDescendant[]
): CustomDescendant => {
  const nodeType = getTemplateType(template)
  return !nodeType
    ? buildTextNode(template)
    : {
        type: nodeType,
        children: children || [TEXT]
      }
}

// This function occasionally causes DOM<=>Slate mapping errors
// Seems to be due to the Transform.insertNodes part
const fixStructure = (
  node: CustomDescendant | undefined,
  path: number[],
  currentTemplate: NodeTemplate,
  nextTemplate: NodeTemplate,
  editor: CustomEditor
): void => {
  // console.log('FIX STRUCTURE')
  let children
  if (node && !isCorrect(node, nextTemplate)) {
    // console.log('delete', node, path)
    children = SlateElement.isElement(node) && node.children
    Transforms.removeNodes(editor, { at: path })
  }
  const correctNode = buildNode(currentTemplate, children)
  // console.log('insert', correctNode, path)
  Transforms.insertNodes(editor, correctNode, {
    at: path
  })
  // console.log('select:', path)
  Transforms.select(editor, path)
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
  // console.log('MATCH STRUCTURE', { structure, node })
  // console.log(editor.operations)
  let i = 0
  let repeatOffset = 0
  let templateExists = true
  while (templateExists) {
    // console.log(i + repeatOffset)
    const currentNode = node.children[i + repeatOffset]
    const currentPath = path.concat(i + repeatOffset)
    const prevTemplate = i > 0 && structure[i - 1]
    const currentTemplate = structure[i]
    const nextTemplate = i < structure.length - 1 && structure[i + 1]
    /* console.log({
      i,
      repeatOffset,
      currentNode,
      prevTemplate,
      currentTemplate,
      nextTemplate
    }) */
    // TODO: min/max repeats
    if (prevTemplate?.repeat && isCorrect(currentNode, prevTemplate)) {
      // console.log('repeat')
      repeatOffset += 1
      // we use the template for switch between block types and onEnter insert
      linkTemplate(currentPath, prevTemplate, editor)
    } else if (!currentTemplate) {
      // break the loop
      templateExists = false
    } else {
      if (!isCorrect(currentNode, currentTemplate)) {
        if (deleteParent(editor, currentTemplate)) {
          // console.log('delete parent')
          Transforms.removeNodes(editor, { at: path })
          return
        }
        fixStructure(
          currentNode,
          currentPath,
          currentTemplate,
          nextTemplate,
          editor
        )
      }
      linkTemplate(currentPath, currentTemplate, editor)
      i += 1
    }
  }
  deleteExcessChildren(structure.length + repeatOffset, node, path, editor)
}

const getSelectedElement = (editor: CustomEditor): NodeEntry<CustomElement> => {
  let selectedNode = Editor.node(editor, editor.selection, { edge: 'end' })
  while (!SlateElement.isElement(selectedNode[0])) {
    selectedNode = Editor.parent(editor, selectedNode[1])
  }
  return selectedNode as NodeEntry<CustomElement>
}

const hasNextSibling = (editor: CustomEditor): boolean =>
  Node.has(
    editor,
    calculateSiblingPath(Editor.path(editor, editor.selection.focus))
  )

// struct allows repeats?
//     |               |
//    YES              NO
// insert first        match last element is struct?
// type in struct      |               |
//                    NO              YES
//                  selectAdjacent    escalate to parent (if not root)
const selectOrInsert = (editor: CustomEditor): void => {
  const target = findInsertTarget(editor)
  if (!target) {
    return selectAdjacent(editor)
  }
  const selectionP = getSelectedElement(editor)[1]
  const [targetN, targetP] = target
  if (selectionP.length !== targetP.length && hasNextSibling(editor)) {
    return selectAdjacent(editor)
  }
  let insertP
  Editor.withoutNormalizing(editor, () => {
    // split nodes at selection
    Transforms.splitNodes(editor, { always: true })
    const splitP = getSelectedElement(editor)[1]
    Transforms.setNodes(
      editor,
      { type: getTemplateType(targetN.template) },
      { at: splitP }
    )
    insertP = calculateSiblingPath(targetP)
    Transforms.moveNodes(editor, { at: splitP, to: insertP })
  })
  selectNode(editor, insertP)
}

export const handleInsert = (
  editor: CustomEditor,
  event: KeyboardEvent<HTMLDivElement>
): void => {
  if (event.key === 'Enter') {
    event.preventDefault()
    selectOrInsert(editor)
  }
}
