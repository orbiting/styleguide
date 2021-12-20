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

/*

if (node selected) {
  if (delete) {
    put cursor at the end of newly inserted node
  } else {
    shift the cursor by one forward (to accommodate for the new insert)
  }
}

 */

const fixStructure = (
  node: CustomDescendant,
  path: number[],
  currentTemplate: NodeTemplate,
  nextTemplate: NodeTemplate,
  editor: CustomEditor
): void => {
  // TODO: handle selection changes
  console.log('FIX STRUCTURE')
  /*console.log('selection', editor.selection)
  if (false) {
    console.log('SELECTED')
  }*/

  let children
  if (node && !isCorrect(node, nextTemplate)) {
    console.log('delete', node, path)
    children = SlateElement.isElement(node) && node.children
    Transforms.removeNodes(editor, { at: path })
  }
  const correctNode = buildNode(currentTemplate, children)
  console.log('insert', correctNode, path)
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
  console.log('MATCH STRUCTURE', structure)
  let i = 0
  let repeatOffset = 0
  while (i < structure.length) {
    const currentNode = node.children[i + repeatOffset]
    const currentPath = path.concat(i + repeatOffset)
    const prevTemplate = i > 0 && structure[i - 1]
    const currentTemplate = structure[i]
    const nextTemplate = i < structure.length - 1 && structure[i + 1]
    console.log({
      currentNode,
      prevTemplate,
      currentTemplate,
      nextTemplate
    })
    // TODO: min/max repeats
    if (prevTemplate?.repeat && isCorrect(currentNode, prevTemplate)) {
      console.log('repeat')
      repeatOffset += 1
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
      i += 1
    }
  }
  deleteExcessChildren(structure.length + repeatOffset, node, path, editor)
}
