import React, { useState, useContext, useEffect, useRef } from 'react'
import { css } from 'glamor'
import { AccordionContext, AccordionItemContext } from './Context'

const styles = {
  body: css({
    overflow: 'hidden',
    transition: 'max-height 0.3s ease'
  }),
  content: css({
    padding: '8px 8px 16px 8px'
  })
}

const AccordionItemBody = ({ children }) => {
  const { eventKey } = useContext(AccordionItemContext)
  const { activeItemIndex } = useContext(AccordionContext)
  const bodyRef = useRef()
  const isOpen = eventKey === activeItemIndex
  return (
    <div
      ref={bodyRef}
      {...styles.body}
      style={{
        maxHeight: isOpen ? bodyRef.current.scrollHeight : 0
      }}
    >
      <div {...styles.content}>{children}</div>
    </div>
  )
}

export default AccordionItemBody
