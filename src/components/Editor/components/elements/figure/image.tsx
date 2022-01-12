import {
  DataFormProps,
  dataRequiredType,
  ElementConfigI,
  FigureImageElement
} from '../../../custom-types'
import React, { Attributes, ReactElement } from 'react'
import ImageInput from './ImageInput'
import { FigureImage } from '../../../../Figure'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
  element: FigureImageElement
}> = ({ attributes, children, element }) => (
  <div {...attributes}>
    { element.src && <FigureImage {...element} />}
    {children}
  </div>
)

const DataForm: React.FC<DataFormProps<FigureImageElement>> = ({
  element,
  setElement
}) => (
  <ImageInput
    src={element.src}
    onChange={src => {
      setElement({
        ...element,
        src
      })
    }}
  />
)

const dataRequired: dataRequiredType<FigureImageElement> = ['src']

export const config: ElementConfigI = {
  Component,
  dataRequired,
  DataForm,
  attrs: {
    isVoid: true,
    editUi: true
  }
}
