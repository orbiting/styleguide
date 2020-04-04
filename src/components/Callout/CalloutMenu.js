import React from 'react'
import MoreIcon from 'react-icons/lib/md/more-vert'
import Callout from './index'
import { plainButtonRule } from '../Button'

const hasAncestor = (node, predicate) => {
  if (predicate(node)) {
    return true
  }
  if (node.parentNode) {
    return hasAncestor(node.parentNode, predicate)
  }
  return false
}

const CalloutMenu = ({ children, icon, align, initiallyOpen }) => {
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
    <div
      ref={toggleRef}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      <button
        {...plainButtonRule}
        onClick={() => {
          setMenu(!showMenu)
        }}
      >
        {icon || <MoreIcon width='calc(1em + 7px)' />}
      </button>
      {showMenu && (
        <Callout onClose={() => setMenu(false)} align={align}>
          {children}
        </Callout>
      )}
    </div>
  )
}

export default CalloutMenu
