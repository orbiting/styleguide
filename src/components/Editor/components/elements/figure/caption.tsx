import { ElementConfigI } from '../../../custom-types'
import { FigureCaption } from '../../../../Figure'

export const config: ElementConfigI = {
  Component: FigureCaption,
  structure: [
    { type: ['text', 'link'], repeat: true },
    { type: 'figureByline' },
    // TODO: this should happen automatically:
    { type: 'text', end: true }
  ],
  attrs: {
    formatText: true
  }
}
