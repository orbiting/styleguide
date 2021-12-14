import { ElementConfigI, FigureImageElement } from '../../../custom-types'
import React, { Attributes, ReactElement } from 'react'
import ImageInput from './ImageInput'
import { ReactEditor, useSlate } from 'slate-react'
import { Transforms } from 'slate'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
  element: FigureImageElement
}> = ({ attributes, children, element }) => {
  const editor = useSlate()
  const path = ReactEditor.findPath(editor, element)
  return (
    <div {...attributes}>
      <ImageInput
        src={element.src}
        onChange={src => {
          const newProperties: Partial<FigureImageElement> = {
            src
          }
          Transforms.setNodes(editor, newProperties, { at: path })
        }}
      />
      {children}
    </div>
  )
}

export const config: ElementConfigI = {
  Component,
  attrs: {
    isVoid: true,
    editUi: true
  }
}
