import { ElementConfigI } from '../../../custom-types'
import { PullQuote } from '../../../../PullQuote'

export const config: ElementConfigI = {
  Component: PullQuote,
  structure: [{ type: 'pullQuoteText', repeat: true }, { type: 'pullQuoteSource' }]
}
