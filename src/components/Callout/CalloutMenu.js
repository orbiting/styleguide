import React from 'react'
import Callout from './index'

const hasAncestor = (node, predicate) => {
  if (predicate(node)) {
    return true
  }
  if (node.parentNode) {
    return hasAncestor(node.parentNode, predicate)
  }
  return false
}

const CalloutMenu = ({
  children,
  Element,
  align,
  initiallyOpen,
  contentPaddingMobile
}) => {
  const [showMenu, setMenu] = React.useState(initiallyOpen)
  const toggleRef = React.useRef()

  const handleClick = e => {
    if (!hasAncestor(e.target, node => node === toggleRef.current)) {
      setMenu(false)
    }
  }

  React.useEffect(() => {
    if (!showMenu) return
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [showMenu])

  return (
    <>
      {showMenu && (
        <Callout
          onClose={() => setMenu(false)}
          align={align}
          contentPaddingMobile={contentPaddingMobile}
        >
          {children}
        </Callout>
      )}
      <div style={{ cursor: 'pointer', zIndex: 1 }}>
        <Element ref={toggleRef} onClick={() => setMenu(!showMenu)} />
      </div>
    </>
  )
}

export default CalloutMenu
