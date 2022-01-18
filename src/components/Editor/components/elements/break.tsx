import React, { Fragment } from 'react'
import { BreakElement, ElementConfigI } from '../../custom-types'
import { BreakIcon } from '../../../Icons'

const Component: React.FC<{
  [x: string]: unknown
}> = ({ children, ...props }) => (
  <Fragment {...props}>
    <br style={{ userSelect: 'none' }} contentEditable={false} />
    {children}
  </Fragment>
)

const node: BreakElement = {
  type: 'break',
  children: [{ text: '' }]
}

export const config: ElementConfigI = {
  Component,
  node,
  attrs: {
    isInline: true,
    isVoid: true,
    skipPlaceholder: true
  },
  button: { icon: BreakIcon, toolbar: 'fixed' }
}
