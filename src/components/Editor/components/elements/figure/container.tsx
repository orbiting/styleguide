import React from 'react'
import {
  ElementConfigI,
  ElementFormProps,
  FigureElement
} from '../../../custom-types'
import { ImageIcon } from '../../../../Icons'
import { Interaction, Label } from '../../../../Typography'
import { Figure } from '../../../../Figure'
import Radio from '../../../../Form/Radio'

const Component: React.FC<{
  element: FigureElement
  [x: string]: unknown
}> = ({ children, element, ...props }) => (
  <Figure {...{ element, ...props }} size={element.size}>
    {children}
  </Figure>
)

// TODO: not the best code – just meant as an example of
//  a parent form accessed through clicking the child...
const Form: React.FC<ElementFormProps<FigureElement>> = ({
  element,
  onChange
}) => (
  <div>
    <Label>Size</Label>
    <Interaction.P>
      <Radio
        value={undefined}
        checked={!element.size}
        onChange={() => onChange({ size: undefined })}
      >
        Normal
      </Radio>
      <br />
      <Radio
        value='tiny'
        checked={element.size === 'tiny'}
        onChange={() => onChange({ size: 'tiny' })}
      >
        Tiny
      </Radio>
    </Interaction.P>
  </div>
)

export const config: ElementConfigI = {
  Component,
  Form,
  structure: [{ type: 'figureImage' }, { type: 'figureCaption' }],
  button: { icon: ImageIcon }
}
