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
import { Element as SlateElement, Text, Node, Transforms } from 'slate'

const TEXT = { text: '' }

const isUseless = (
  node?: CustomElement,
  nextTemplate?: NodeTemplate
): boolean =>
  node &&
  node.type !== getTemplateType(nextTemplate) &&
  Node.string(node) === '' &&
  Object.keys(node).length <= 2

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
  const bookend = template.bookend ? { bookend: true } : {}
  return {
    ...TEXT,
    ...bookend
  }
}

const buildNode = (template: NodeTemplate): CustomDescendant => {
  const nodeType = getTemplateType(template)
  return !nodeType
    ? buildTextNode(template)
    : {
        type: nodeType,
        children: [TEXT]
      }
}

const fixStructure = (
  node: CustomElement,
  path: number[],
  currentTemplate: NodeTemplate,
  nextTemplate: NodeTemplate,
  editor: CustomEditor
): void => {
  //console.log('FIX STRUCTURE')
  if (isUseless(node, nextTemplate)) {
    //console.log('delete', node)
    Transforms.removeNodes(editor, { at: path })
  }
  const correctNode = buildNode(currentTemplate)
  //console.log('insert', correctNode)
  Transforms.insertNodes(editor, correctNode, {
    at: path
  })
}

const deleteExcessChildren = (
  from: number,
  node: CustomElement,
  path: number[],
  editor: CustomEditor
): void => {
  //console.log('DELETE EXCESS', from, 'vs', node.children.length)
  for (let i = from; i < node.children.length; i++) {
    Transforms.removeNodes(editor, { at: path.concat(i) })
  }
}

export const matchStructure: (
  structure?: NodeTemplate[]
) => NormalizeFn<CustomElement> = structure => ([node, path], editor) => {
  if (!structure) return
  //console.log('MATCH STRUCTURE', structure)
  let i = 0
  let repeatOffset = 0
  while (i < structure.length) {
    const currentNode = node.children[i + repeatOffset]
    const currentPath = path.concat(i)
    const prevTemplate = i > 0 && structure[i - 1]
    const currentTemplate = structure[i]
    const nextTemplate = i > structure.length - 1 && structure[i + 1]
    /*console.log({
      currentNode,
      prevTemplate,
      currentTemplate,
      nextTemplate
    })*/
    if (prevTemplate?.repeat && isCorrect(currentNode, prevTemplate)) {
      repeatOffset += 1
    } else {
      if (!isCorrect(currentNode, currentTemplate)) {
        fixStructure(
          currentNode as CustomElement,
          currentPath,
          currentTemplate,
          nextTemplate,
          editor
        )
      }
      i += 1
    }
  }
  deleteExcessChildren(structure.length + repeatOffset, node, path, editor)
}
