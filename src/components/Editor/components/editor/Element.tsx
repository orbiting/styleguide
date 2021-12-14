import React, { Attributes, ReactElement } from 'react'
import {
  Editor,
  Element as SlateElement,
  Transforms,
  Node,
  BasePoint,
  Text
} from 'slate'
import { useSlate } from 'slate-react'

import { config, configKeys, coreEditorAttrs } from '../elements'
import { ToolbarButton } from './ui/Toolbar'
import {
  CustomEditor,
  CustomElement,
  CustomElementsType,
  CustomText,
  NodeTemplate,
  NormalizeFn
} from '../../custom-types'
import { getElConfig, testSomeChildEl } from './helpers/element'
import { matchStructure } from './helpers/structure'

export const matchElement = (elKey: CustomElementsType) => (n): boolean =>
  !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === elKey

export const ContainerComponent: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ attributes, children }) => {
  return <div {...attributes}>{children}</div>
}

export const ElementButton: React.FC<{
  elKey: CustomElementsType
  disabled?: boolean
}> = ({ elKey, disabled }) => {
  const editor = useSlate()
  const element = config[elKey]
  if (!element?.button) {
    return null
  }
  return (
    <ToolbarButton
      button={element.button}
      disabled={disabled}
      onClick={() =>
        element.insert
          ? element.insert(editor)
          : element.node
          ? Transforms.insertNodes(editor, element.node)
          : console.warn(`Element ${elKey} missing insert/node definition`)
      }
    />
  )
}

export const withTemplate = (template: CustomElement[]) => (
  editor: CustomEditor
): CustomEditor => {
  const { normalizeNode } = editor

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length === 0) {
        Transforms.insertNodes(editor, template, { at: path.concat(0) })
      }
      for (const [child, childPath] of Node.children(editor, path)) {
        const currentType = SlateElement.isElement(child) && child.type
        if (childPath[0] === 0 && currentType !== 'headline') {
          const newProperties: Partial<SlateElement> = { type: 'headline' }
          Transforms.setNodes(editor, newProperties, { at: childPath })
        } else if (childPath[0] !== 0 && currentType === 'headline') {
          const newProperties: Partial<SlateElement> = { type: 'paragraph' }
          Transforms.setNodes(editor, newProperties, { at: childPath })
        } else if (
          childPath[0] === editor.children.length - 1 &&
          currentType !== template[template.length - 1].type
        ) {
          Transforms.insertNodes(editor, template[template.length - 1], {
            at: path.concat(editor.children.length)
          })
        }
      }
    }

    return normalizeNode([node, path])
  }

  return editor
}

const hasNoBreakAncestor = (editor: CustomEditor, path?: BasePoint): boolean =>
  testSomeChildEl(
    node => !!getElConfig(node)?.attrs?.disableBreaks,
    editor,
    path
  )

// TODO: jump to next node instead of just disabling breaks
//  move this in the normalisation logic
export const withBreaksDisabled = (editor: CustomEditor): CustomEditor => {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    const { selection } = editor

    if (
      hasNoBreakAncestor(editor, selection?.anchor) ||
      hasNoBreakAncestor(editor, selection?.focus)
    ) {
      return
    }
    return insertBreak()
  }

  return editor
}

export const withElAttrsConfig = (editor: CustomEditor): CustomEditor => {
  coreEditorAttrs.forEach(attr => {
    const editorCheck = editor[attr]
    editor[attr] = element =>
      (config[element.type]?.attrs || {})[attr] || editorCheck(element)
  })
  return editor
}

// Bookends are a special type of leaf nodes.
// As Slate requires the first and last inline nodes to be text nodes,
// we use bookend
const handleBookends: NormalizeFn<CustomText> = ([node, path], editor) => {
  if (!node.bookend || !node.text) return
  const previous = Editor.previous(editor, { at: path })
  // TODO
  //  const next = Editor.next(editor, { at: path })
  if (previous && SlateElement.isElement(previous[0])) {
    Transforms.insertNodes(
      editor,
      { text: node.text },
      { at: previous[1].concat(previous[0].children.length) }
    )
    Transforms.select(editor, previous[1])
    Transforms.insertText(editor, '', { at: path })
  }
}

export const withNormalizations = (topLevelStructure?: NodeTemplate[]) => (
  editor: CustomEditor
): CustomEditor => {
  const { normalizeNode } = editor
  editor.normalizeNode = ([node, path]) => {
    console.log('normalize', node, path)
    // root normalization
    if (!path.length) {
      console.log('normalize root')
      matchStructure(topLevelStructure)([node as CustomElement, path], editor)
      return
    }
    // text normalization
    if (Text.isText(node)) {
      handleBookends([node as CustomText, path], editor)
      return
    }
    // elements normalization
    if (SlateElement.isElement(node)) {
      const elConfig = config[node.type]
      const customNormalizations = (elConfig.normalizations || []).concat(
        matchStructure(elConfig.structure)
      )
    }
    configKeys.forEach(elKey => {
      if (matchElement(elKey)(node)) {
        /*const customNormalizations = [
          matchStructure(elConfig.structure)
        ].concat(elConfig.normalizations || [])
        customNormalizations.forEach(normalizeFn =>
          normalizeFn([node as CustomElement, path], editor)
        )
        return*/
      }
    })
    normalizeNode([node, path])
  }
  return editor
}
