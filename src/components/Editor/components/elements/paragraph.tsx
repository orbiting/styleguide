import { Editorial } from '../../../Typography'
import { ElementConfigI } from '../../custom-types'

export const config: ElementConfigI = {
  Component: Editorial.P,
  structure: [{ type: ['text', 'link', 'break'], repeat: true }],
  attrs: {
    formatText: true
  }
}