import {
  ElementConfigI,
  ElementFormProps,
  FigureElement
} from '../../../custom-types'
import { ImageIcon } from '../../../../Icons'
import React from 'react'
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

// TODO: this needn't be – can be inferred.
// the insert button can generate the node based on the element key
// inline nodes have a different logic (see links)
const node: FigureElement = {
  type: 'figure',
  children: [{ text: '' }]
}

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
  node,
  Form,
  structure: [{ type: 'figureImage' }, { type: 'figureCaption' }],
  button: { icon: ImageIcon, toolbar: 'fixed' }
}
