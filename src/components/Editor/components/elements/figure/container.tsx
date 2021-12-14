import { ElementConfigI } from '../../../custom-types'
import { ContainerComponent } from '../../editor/Element'
import { ImageIcon } from '../../../../Icons'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  structure: [{ type: 'figureImage' }, { type: 'figureCaption' }],
  attrs: {
    disableBreaks: true
  },
  button: { icon: ImageIcon, toolbar: 'fixed' }
}
