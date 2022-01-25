import { ElementConfigI } from '../../../custom-types'
import { PullQuote } from '../../../../PullQuote'
import { QuoteIcon } from '../../../../Icons'

export const config: ElementConfigI = {
  Component: PullQuote,
  structure: [
    { type: 'pullQuoteText', repeat: true },
    { type: 'pullQuoteSource' }
  ],
  button: { icon: QuoteIcon }
}
