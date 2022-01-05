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
import { Element as SlateElement, Text, Transforms } from 'slate'
import { findRepeatNode, selectAdjacent } from './tree'

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

const fixStructure = (
  node: CustomDescendant | undefined,
  path: number[],
  currentTemplate: NodeTemplate,
  nextTemplate: NodeTemplate,
  editor: CustomEditor
): void => {
  // TODO: handle selection changes
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

export const matchStructure: (
  structure?: NodeTemplate[]
) => NormalizeFn<CustomElement> = (structure = DEFAULT_STRUCTURE) => (
  [node, path],
  editor
) => {
  // console.log('MATCH STRUCTURE', { structure, node })
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
      // we do this for convenience's sake
      linkTemplate(currentPath, prevTemplate, editor)
    } else if (!currentTemplate) {
      templateExists = false
    } else {
      if (!isCorrect(currentNode, currentTemplate)) {
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

const selectOrInsert = (
  editor: CustomEditor,
  event: KeyboardEvent<HTMLDivElement>
): void => {
  const insert = findRepeatNode(editor)
  if (!insert) {
    event.preventDefault()
    selectAdjacent(editor)
  }
}

export const handleStructure = (
  editor: CustomEditor,
  event: KeyboardEvent<HTMLDivElement>
): void => {
  if (event.key === 'Enter') {
    selectOrInsert(editor, event)
  }
}
