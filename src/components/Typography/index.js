import React from 'react'
import * as styles from './styles'
import {css} from 'glamor'

export const fontStyles = styles
export { default as Editorial } from './Editorial'

export const linkRule = css(styles.link)
export const A = ({children, ...props}) => (
  <a {...props} {...linkRule}>{children}</a>
)

const h1Rule = css(styles.h1)
export const H1 = ({children, ...props}) => (
  <h1 {...props} {...h1Rule}>{children}</h1>
)

const h2Rule = css(styles.h2)
export const H2 = ({children, ...props}) => (
  <h2 {...props} {...h2Rule}>{children}</h2>
)

const leadRule = css(styles.lead)
export const Lead = ({children, ...props}) => (
  <p {...props} {...leadRule}>{children}</p>
)

const pRule = css(styles.p)
export const P = ({children, ...props}) => (
  <p {...props} {...pRule}>{children}</p>
)

const labelRule = css(styles.label)
export const Label = ({children, ...props}) => (
  <span {...props} {...labelRule}>{children}</span>
)

const quoteRule = css(styles.quote)
const quoteTextRule = css(styles.quoteText)

export const Quote = ({children, source, ...props}) => (
  <blockquote {...props} {...quoteRule}>
    <div {...quoteTextRule}>«{children}»</div>
    {!!source && <cite>{source}</cite>}
  </blockquote>
)

const iHeadlineRule = css(styles.interactionHeadline)
const iH1Rule = css(styles.interactionH1)
const iH2Rule = css(styles.interactionH2)
const iH3Rule = css(styles.interactionH3)
const iPRule = css(styles.interactionP)

export const Interaction = {
  Headline: ({children, ...props}) => (
    <h1 {...props} {...iHeadlineRule}>{children}</h1>
  ),
  H1: ({children, ...props}) => (
    <h1 {...props} {...iH1Rule}>{children}</h1>
  ),
  H2: ({children, ...props}) => (
    <h2 {...props} {...iH2Rule}>{children}</h2>
  ),
  H3: ({children, ...props}) => (
    <h3 {...props} {...iH3Rule}>{children}</h3>
  ),
  P: ({children, ...props}) => (
    <p {...props} {...iPRule}>{children}</p>
  )
}
