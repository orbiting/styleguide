import React from 'react'
import * as styles from './styles'
import { css } from 'glamor'
import colors from '../../theme/colors'
import { mUp } from '../../theme/mediaQueries'
import { fontStyles } from '../../theme/fonts'
import { convertStyleToRem, pxToRem } from './utils'
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

const subhead = css({
  ...convertStyleToRem(styles.sansSerifMedium19),
  margin: '36px 0 8px 0',
  [mUp]: {
    ...convertStyleToRem(styles.sansSerifMedium24),
    margin: '46px 0 12px 0'
  }
})

export const Subhead = ({ children, attributes, ...props }) => {
  const [
    {
      rules: { textColor }
    }
  ] = useColorContext()
  return (
    <h2 {...attributes} {...props} {...subhead} {...textColor}>
      {children}
    </h2>
  )
}

const interactionP = css({
  margin: '22px 0 22px 0',
  ...convertStyleToRem(styles.sansSerifRegular17),
  [mUp]: {
    ...convertStyleToRem(styles.sansSerifRegular19),
    margin: `${pxToRem(30)} 0 ${pxToRem(30)} 0`
  },
  ':first-child': {
    marginTop: 0
  },
  ':last-child': {
    marginBottom: 0
  },
  'h2 + &': {
    marginTop: 0
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

const lead = css({
  ...convertStyleToRem(styles.sansSerifRegular19),
  display: 'inline',
  margin: '0 0 10px 0',
  [mUp]: {
    ...convertStyleToRem(styles.sansSerifRegular23),
    margin: '0 0 20px 0'
  }
})

export const Lead = ({ children, attributes, ...props }) => {
  const [
    {
      rules: { textColor }
    }
  ] = useColorContext()
  return (
    <p {...attributes} {...props} {...lead} {...textColor} {...fontRule}>
      {children}
    </p>
  )
}