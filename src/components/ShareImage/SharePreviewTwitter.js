import React from 'react'
import { css } from 'glamor'

export const imageStyle = css({
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
  // boxshadow of image is 2x that of text container beacuse
  // a scale 0.5 is applied on it.
  boxShadow: '0px 0px 2px 2px rgb(204, 214, 221)'
})

const styles = {
  container: css({
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#000',
    width: 600,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    boxShadow: '0px 0px 1px 1px rgb(204, 214, 221)',
    padding: '10.5px 14px',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    maxHeight: 120,
    overflow: 'hidden'
  }),
  title: css({
    maxHeight: '1.3em',
    fontSize: '1em',
    lineHeight: '1.3em',
    margin: '0 0 .15em',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontWeight: 'bold'
  }),
  description: css({
    fontSize: '1em',
    lineHeight: '1.3em',
    marginTop: '.32333em',
    overflow: 'hidden',
    maxHeight: '2.6em'
  }),
  domain: css({
    fontSize: '1em',
    lineHeight: '1.3em',
    marginTop: '.32333em',
    textTransform: 'lowercase',
    color: '#8899A6',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  })
}

const SharePreviewTwitter = ({ title, description }) => (
  <div {...styles.container}>
    <div {...styles.title}>{title}</div>
    <div {...styles.description}>{description}</div>
    <div {...styles.domain}>republik.ch</div>
  </div>
)

export default SharePreviewTwitter