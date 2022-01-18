import {
  ElementConfigI,
  ElementFormProps,
  FigureImageElement
} from '../../../custom-types'
import React from 'react'
import ImageInput from './ImageInput'
import { FigureImage } from '../../../../Figure'
import { Label } from '../../../../Typography'

const Component: React.FC<{
  element: FigureImageElement
  [x: string]: unknown
}> = ({ children, element, ...props }) => (
  <div {...props}>
    <div style={{ userSelect: 'none' }} contentEditable={false}>
      <FigureImage
        {...{ src: element.src || '/static/placeholder.png', ...element }}
      />
    </div>
    {children}
  </div>
)

const Form: React.FC<ElementFormProps<FigureImageElement>> = ({
  element,
  onChange
}) => (
  <div>
    <div>
      <Label>Light mode</Label>
      <ImageInput
        src={element.src}
        onChange={src => {
          onChange({ src })
        }}
      />
    </div>
    <div>
      <Label>Dark mode (optional)</Label>
      <ImageInput
        src={element.srcDark}
        onChange={srcDark => {
          onChange({ srcDark })
        }}
      />
    </div>
  </div>
)

export const config: ElementConfigI = {
  Component,
  Form,
  attrs: {
    isVoid: true,
    editUi: true
  }
}
