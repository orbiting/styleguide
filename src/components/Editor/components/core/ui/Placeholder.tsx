import React from 'react'
import { css } from 'glamor'
import { ReactEditor, useSlate } from 'slate-react'
import { Editor, Transforms } from 'slate'
import { getTextNode } from '../helpers/tree'
import { CustomElement } from '../../../custom-types'
import { toTitle } from '../helpers/text'
import set = Reflect.set

const styles = {
  inInline: css({
    cursor: 'text',
    opacity: 0.333,
    ':empty::after': {
      content: 'attr(data-text)'
    }
  })
}

export const Placeholder: React.FC<{
  element: CustomElement
}> = ({ element }) => {
  const editor = useSlate()
  const placeholderText = toTitle(element.type)
  const onClick = () => {
    // TODO: fix issue with hovering toolbar
    console.log('PLACEHOLDER')
    const parentPath = ReactEditor.findPath(editor, element)
    const parentNode = Editor.node(editor, parentPath)
    console.log(parentNode)
    const [textNode, textPath] = getTextNode(parentNode, editor)
    console.log(textNode, textPath)
    // this is a hack so that the element is selected before the change already
    // (selecting empty text nodes is a problem)
    Transforms.insertText(editor, ' ', { at: textPath })
    ReactEditor.focus(editor)
    Transforms.select(editor, textPath)
    setTimeout(() => {
      Transforms.insertText(editor, placeholderText, { at: textPath })
      ReactEditor.focus(editor)
      Transforms.select(editor, textPath)
    }, 0)
  }
  return (
    <span
      {...styles.inInline}
      style={{ userSelect: 'none' }}
      contentEditable={false}
      onClick={onClick}
      data-text={placeholderText}
    />
  )
}
