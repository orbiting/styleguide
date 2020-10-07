import React from 'react'
import * as styles from './styles'
import { css } from 'glamor'
import colors from '../../theme/colors'
import { mUp } from '../../theme/mediaQueries'
import { fontStyles } from '../../theme/fonts'
import { convertStyleToRem } from './utils'
import { useColorContext } from '../Colors/useColorContext'

export const fontRule = css({
  ...fontStyles.sansSerifRegular,
  '& em, & i': fontStyles.sansSerifItalic,
  '& strong, & b': fontStyles.sansSerifMedium,
  '& strong em, & em strong, & b i, & i b': {
    textDecoration: `underline wavy ${colors.error}`
  }
})

const interactionHeadline = css({
  margin: '0 0 12px 0',
  ...convertStyleToRem(styles.sansSerifMedium30),
  [mUp]: {
    ...convertStyleToRem(styles.sansSerifMedium58)
  },
  ':first-child': {
    marginTop: 0
  },
  ':last-child': {
    marginBottom: 0
  }
})

const interactionH1 = css({
  ...convertStyleToRem(styles.sansSerifMedium30),
  [mUp]: {
    ...convertStyleToRem(styles.sansSerifMedium40)
  },
  margin: 0
})

const interactionH2 = css({
  ...convertStyleToRem(styles.sansSerifMedium22),
  [mUp]: {
    ...convertStyleToRem(styles.sansSerifMedium30)
  },
  margin: 0
})

const interactionH3 = css({
  ...convertStyleToRem(styles.sansSerifMedium19),
  [mUp]: {
    ...convertStyleToRem(styles.sansSerifMedium22)
  },
  margin: 0
})

export const Headline = ({ children, ...props }) => {
  const [
    {
      rules: { textColor }
    }
  ] = useColorContext()
  return (
    <h1 {...props} {...interactionHeadline} {...textColor}>
      {children}
    </h1>
  )
}

export const H1 = ({ children, ...props }) => {
  const [
    {
      rules: { textColor }
    }
  ] = useColorContext()
  return (
    <h1 {...props} {...interactionH1} {...textColor}>
      {children}
    </h1>
  )
}

export const H2 = ({ children, ...props }) => {
  const [
    {
      rules: { textColor }
    }
  ] = useColorContext()
  return (
    <h2 {...props} {...interactionH2} {...textColor}>
      {children}
    </h2>
  )
}

const subhead = css({
  margin: '8px 0 8px 0',
  'p + &': {
    marginTop: 40
  },
  [mUp]: {
    margin: '12px 0 12px 0',
    'p + &': {
      marginTop: 80
    }
  }
})

export const Subhead = ({ children, ...props }) => {
  return (
    <div {...subhead}>
      <H2 {...props}>{children}</H2>
    </div>
  )
}

export const H3 = ({ children, ...props }) => {
  const [
    {
      rules: { textColor }
    }
  ] = useColorContext()
  return (
    <h3 {...props} {...interactionH3} {...textColor}>
      {children}
    </h3>
  )
}

const interactionP = css({
  margin: 0,
  ...convertStyleToRem(styles.sansSerifRegular17),
  [mUp]: {
    ...convertStyleToRem(styles.sansSerifRegular21)
  }
})

export const P = ({ children, ...props }) => {
  const [
    {
      rules: { textColor }
    }
  ] = useColorContext()
  return (
    <p {...props} {...interactionP} {...fontRule} {...textColor}>
      {children}
    </p>
  )
}

const emphasis = css(fontStyles.sansSerifMedium)
export const Emphasis = ({ children, attributes, ...props }) => (
  <strong {...props} {...attributes} {...emphasis}>
    {children}
  </strong>
)

const cursive = css(fontStyles.sansSerifItalic)
export const Cursive = ({ children, attributes, ...props }) => (
  <em {...props} {...attributes} {...cursive}>
    {children}
  </em>
)
