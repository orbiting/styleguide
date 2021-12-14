import {
  CustomDescendant,
  CustomElement,
  CustomElementsType,
  NodeTemplate,
  NormalizeFn,
  TemplateType
} from '../../../custom-types'
import { Element as SlateElement, Text, Transforms } from 'slate'
import { config as elConfig } from '../../elements'

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
  for (let i = 0; i < structure.length; i++) {
    const template = structure[i]
    const currentNode = node.children[i]
    if (!isCorrect(currentNode, template)) {
      const fillerNode = buildNode(template)
      return Transforms.insertNodes(editor, fillerNode, {
        at: path.concat(i)
      })
    }
  }
}
