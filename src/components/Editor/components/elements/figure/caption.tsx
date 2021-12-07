import { ElementConfigI } from '../../../custom-types'
import { FigureCaption } from '../../../../Figure'

export const config: ElementConfigI = {
  Component: FigureCaption,
  structure: [
    { type: ['text', 'link'], repeat: true },
    { type: 'figureByline' },
    // TODO: this should happen automatically:
    { type: 'text', bookend: true }
  ],
  attrs: {
    formatText: true
  }
}
