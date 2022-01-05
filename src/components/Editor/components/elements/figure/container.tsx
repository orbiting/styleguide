import { ElementConfigI, FigureElement } from '../../../custom-types'
import { ContainerComponent } from '../../core/Element'
import { ImageIcon } from '../../../../Icons'

// TODO: this needn't be – can be inferred.
// the insert button can generate the node based on the element key
const node: FigureElement = {
  type: 'figure',
  children: [{ text: '' }]
}

export const config: ElementConfigI = {
  Component: ContainerComponent,
  node,
  structure: [{ type: 'figureImage' }, { type: 'figureCaption' }],
  button: { icon: ImageIcon, toolbar: 'fixed' }
}
