import {
  dataRequiredType,
  ElementConfigI,
  FigureImageElement,
  StandaloneFormProps
} from '../../../custom-types'
import React, { Attributes, ReactElement } from 'react'
import ImageInput from './ImageInput'
import { FigureImage } from '../../../../Figure'
import { Interaction, Label } from '../../../../Typography'
import { css } from 'glamor'

const styles = {
  formContainer: css({
    display: 'flex',
    maxWidth: 690
  })
}

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
  element: FigureImageElement
}> = ({ attributes, children, element }) => (
  <div {...attributes}>
    {element.src && <FigureImage {...element} />}
    {children}
  </div>
)

const Form: React.FC<StandaloneFormProps<FigureImageElement>> = ({
  element,
  setElement
}) => (
  <div>
    <Interaction.H2>Share a picture</Interaction.H2>
    <div {...styles.formContainer}>
      <div>
        <Label>Light mode</Label>
        <ImageInput
          src={element.src}
          onChange={src => {
            setElement({
              ...element,
              src
            })
          }}
        />
      </div>
      <div>
        <Label>Dark mode (optional)</Label>
        <ImageInput
          src={element.srcDark}
          onChange={srcDark => {
            setElement({
              ...element,
              srcDark
            })
          }}
        />
      </div>
    </div>
  </div>
)

const dataRequired: dataRequiredType<FigureImageElement> = ['src']

export const config: ElementConfigI = {
  Component,
  dataRequired,
  StandaloneForm: Form,
  attrs: {
    isVoid: true,
    editUi: true
  }
}
