import {
  CustomDescendant,
  CustomElement,
  CustomElementsType,
  NodeTemplate,
  NormalizeFn,
  TemplateType
} from '../../../custom-types'
import { Element as SlateElement, Node, Text, Transforms } from 'slate'
import { config as elConfig } from '../../elements'

const TEXT = { text: '' }

const isEmpty = (node: Node): boolean =>
  Node.string(node) === '' && Object.keys(node).length <= 2

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
    node.bookend === template.bookend) ||
  (SlateElement.isElement(node) && isAllowedType(node.type, template.type))

export const getNodeType = (
  template: NodeTemplate
): CustomElementsType | undefined => {
  const nodeType = Array.isArray(template.type)
    ? template.type[0]
    : template.type
  return nodeType !== 'text' ? nodeType : undefined
}

export const buildNode = (
  template: NodeTemplate,
  withChildren?: boolean
): CustomDescendant => {
  const nodeType = getNodeType(template)
  return !nodeType
    ? { ...TEXT, bookend: template.bookend }
    : {
        type: nodeType,
        children: (withChildren &&
          elConfig[nodeType].structure?.map(t => buildNode(t, true))) || [TEXT]
      }
}

export const matchStructure: (
  structure?: NodeTemplate[]
) => NormalizeFn<CustomElement> = structure => ([node, path], editor) => {
  if (!structure) return
  console.log('MATCH STRUCTURE', structure)
  let repeatOffset = 0
  for (let i = 0; i < structure.length; i++) {
    const currentNode = node.children[i + repeatOffset]
    const template = structure[i]
    console.log({
      currentNode,
      prevTemplate: structure[i - 1],
      currentTemplate: structure[i]
    })
    if (
      i > 0 &&
      structure[i - 1].repeat &&
      isCorrect(currentNode, structure[i - 1])
    ) {
      repeatOffset += 1
    } else if (!isCorrect(currentNode, template)) {
      const currentPath = path.concat(i)
      if (currentNode && isEmpty(currentNode)) {
        Transforms.removeNodes(editor, { at: currentPath })
      }
      const correctNode = buildNode(template)
      Transforms.insertNodes(editor, correctNode, {
        at: currentPath
      })
    }
  }
  // delete excess nodes
  for (let i = structure.length + repeatOffset; i < node.children.length; i++) {
    Transforms.removeNodes(editor, { at: path.concat(i) })
  }
}
