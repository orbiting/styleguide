import React from 'react'
import colors from '../../../theme/colors'
import { fontFamilies } from '../../../theme/fonts'

export const paragraphStyle = {
  color: colors.text,
  fontSize: '16px',
  lineHeight: '158%',
  margin: '10px 0',
  fontFamily: fontFamilies.serifRegular
}

export const linkStyle = {
  color: colors.text,
  textDecoration: 'underline',
  textDecorationSkip: 'ink'
}

const emphasisStyle = {
  color: colors.text,
  fontFamily: fontFamilies.serifBold,
  fontWeight: 'normal'
}

const cursiveStyle = {
  fontFamily: fontFamilies.serifItalic,
  fontWeight: 'normal'
}

const strikeThroughStyle = {
  textDecoration: 'line-through'
}

const codeStyle = {
  backgroundColor: '#f7f7f7',
  borderRadius: '2px',
  display: 'inline-block',
  fontFamily: fontFamilies.monospaceRegular,
  fontSize: '14px',
  padding: '0 5px'
}

export const Emphasis = ({ children }) => (
  <strong style={emphasisStyle}>{children}</strong>
)

export const Cursive = ({ children }) => (
  <em style={cursiveStyle}>{children}</em>
)

export const Link = ({ children, href, title }) => (
  <a href={href} title={title} style={linkStyle}>
    {children}
  </a>
)

export const StrikeThrough = ({ children }) => (
  <span style={strikeThroughStyle}>{children}</span>
)

export const Code = ({ children }) => (
  <code style={codeStyle}>{children}</code>
)

export const Paragraph = ({ children }) => (
  <p style={paragraphStyle}>{children}</p>
)

export const Heading = ({ children }) => (
  <Paragraph><Emphasis>{children}</Emphasis></Paragraph>
)
