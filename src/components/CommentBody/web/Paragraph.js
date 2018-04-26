import React from 'react'
import { css } from 'glamor'

import * as Editorial from '../../Typography/Editorial'
import { mUp } from '../../../theme/mediaQueries'
import { serifRegular14, serifRegular16 } from '../../Typography/styles'

const styles = {
  p: css({
    ...serifRegular14,
    [mUp]: {
      ...serifRegular16
    },
    margin: '10px 0',
    ':first-child': {
      marginTop: 0
    },
    ':last-child': {
      marginBottom: 0
    }
  }),
  code: css({
    backgroundColor: '#f7f7f7',
    borderRadius: '2px',
    display: 'inline-block',
    fontSize: '90%',
    padding: '0 5px'
  })
}

const Paragraph = ({ children }) => (
  <p {...styles.p}>{children}</p>
)

export const Heading = ({ children }) => (
  <Paragraph><Editorial.Emphasis>{children}</Editorial.Emphasis></Paragraph>
)

export const Code = ({ children }) => (
  <code {...styles.code}>{children}</code>
)

export default Paragraph
