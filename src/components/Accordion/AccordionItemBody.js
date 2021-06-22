import React, { useState, useContext, useEffect, useRef } from 'react'
import { css } from 'glamor'
import { AccordionContext, AccordionItemContext } from './Context'

const styles = {
  body: css({
    overflow: 'hidden',
    transition: 'height 0.3s ease'
  }),
  content: css({
    padding: '8px 8px 16px 8px'
  })
}

const AccordionItemBody = ({ children }) => {
  const { eventKey } = useContext(AccordionItemContext)
  const { activeItemIndex } = useContext(AccordionContext)
  const [bodyHeight, setBodyHeight] = useState(0)

  const bodyRef = useRef()
  const isOpen = eventKey === activeItemIndex

  useEffect(() => {
    if (isOpen) {
      setBodyHeight(bodyRef.current.scrollHeight)
    } else {
      setBodyHeight(0)
    }
  }, [isOpen])

  return (
    <div
      ref={bodyRef}
      {...styles.body}
      style={{
        height: bodyHeight
      }}
    >
      <div {...styles.content}>{children}</div>
    </div>
  )
}

export default AccordionItemBody
