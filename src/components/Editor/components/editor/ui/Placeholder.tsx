import React from 'react'
import { css } from 'glamor'
import { ReactEditor, useSlate } from 'slate-react'
import { Editor, Transforms } from 'slate'
import { getTextNode } from '../helpers/tree'
import { CustomElement } from '../../../custom-types'

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
  const placeholderText = element.type.replace(/([A-Z])/g, ' $1').toLowerCase()
  const onMouseDown = () => {
    // TODO: fix issue with hovering toolbar
    // console.log('PLACEHOLDER')
    const parentPath = ReactEditor.findPath(editor, element)
    const parentNode = Editor.node(editor, parentPath)
    // console.log(parentNode)
    const [textNode, textPath] = getTextNode(parentNode)
    // console.log(textNode, textPath)
    ReactEditor.focus(editor)
    Transforms.insertText(editor, placeholderText, { at: textPath })
    Transforms.select(editor, textPath)
  }
  return (
    <span
      {...styles.inInline}
      onMouseDown={onMouseDown}
      data-text={placeholderText}
    />
  )
}
