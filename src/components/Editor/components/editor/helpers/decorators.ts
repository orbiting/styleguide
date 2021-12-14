import {
  CustomEditor,
  CustomElement,
  NodeTemplate,
  NormalizeFn
} from '../../../custom-types'
import { config, coreEditorAttrs } from '../../elements'
import { Element as SlateElement, Text } from 'slate'
import { matchStructure } from './structure'
import { handleBookends } from './bookends'

export const withElAttrsConfig = (editor: CustomEditor): CustomEditor => {
  coreEditorAttrs.forEach(attr => {
    const editorCheck = editor[attr]
    editor[attr] = element =>
      (config[element.type]?.attrs || {})[attr] || editorCheck(element)
  })
  return editor
}

const getCustomNormalizations = (
  node: SlateElement
): NormalizeFn<CustomElement>[] => {
  const elConfig = config[node.type]
  return (elConfig.normalizations || []).concat(
    matchStructure(elConfig.structure)
  )
}

export const withNormalizations = (topLevelStructure?: NodeTemplate[]) => (
  editor: CustomEditor
): CustomEditor => {
  const { normalizeNode } = editor
  editor.normalizeNode = ([node, path]) => {
    // top-level normalization
    if (path.length === 0) {
      matchStructure(topLevelStructure)([node as CustomElement, path], editor)
      return
    }
    // text normalization
    if (Text.isText(node)) {
      handleBookends([node, path], editor)
      return
    }
    // element normalization
    if (SlateElement.isElement(node)) {
      getCustomNormalizations(node).forEach(normalizeFn =>
        normalizeFn([node, path], editor)
      )
      return
    }
    normalizeNode([node, path])
  }
  return editor
}
