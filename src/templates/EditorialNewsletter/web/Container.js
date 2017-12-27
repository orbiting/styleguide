import React from 'react'
import { css } from 'glamor'
import Header from './Header'

const styles = {
  container: {
    fontFamily: 'serif',
    fontSize: 18,
    color: '#000',
    WebkitFontSmoothing: 'antialiased',
    backgroundColor: '#fff',
    width: '100%',
    margin: 0,
    padding: 0
  }
}

export default ({ children, attributes = {} }) => (
  <div {...css(styles.container)} {...attributes}>
    <Header />
    {children}
  </div>
)
