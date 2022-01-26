import React, { ReactElement, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { css } from 'glamor'
import { Marks } from './Mark'
import { InsertButton } from './Element'
import {
  ButtonI,
  CustomEditor,
  CustomElement,
  CustomElementsType,
  CustomText,
  TemplateType
} from '../../../custom-types'
import { config as elConfig } from '../../elements'
import { useSlate, ReactEditor } from 'slate-react'
import { Editor, Range } from 'slate'
import { useColorContext } from '../../../../Colors/ColorContext'
import IconButton from '../../../../IconButton'
import { getCommonDirectAncestry } from '../helpers/tree'

const IMPLICIT_TEMPLATE_TYPES: TemplateType[] = ['text', 'break']

const styles = {
  hoveringToolbar: css({
    padding: '8px 7px 6px',
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    overflow: 'hidden',
    marginTop: -6,
    opacity: 0,
    display: 'flex',
    transition: 'opacity 0.75s'
  }),
  buttonGroup: css({
    display: 'flex'
  })
}

const hasVisibleSelection = (editor: CustomEditor): boolean => {
  const { selection } = editor
  return (
    !!selection &&
    !Range.isCollapsed(selection) &&
    ReactEditor.isFocused(editor) &&
    Editor.string(editor, selection) !== ''
  )
}

const showMarks = (
  editor: CustomEditor,
  selectedText: CustomText | undefined,
  selectedElement: CustomElement | undefined
): boolean => {
  // console.log('showMarks', selectedText, selectedElement)
  return (
    selectedText &&
    selectedElement &&
    elConfig[selectedElement.type].attrs?.formatText &&
    Editor.string(editor, editor.selection) !== selectedText.placeholder
  )
}

const getAllowedTypes = (
  editor: CustomEditor,
  selectedNode: CustomText | CustomElement | undefined
): CustomElementsType[] => {
  if (!selectedNode) return []
  const template = selectedNode.template
  if (!template || !template.type) return []
  return (Array.isArray(template.type)
    ? template.type
    : [template.type]
  ).filter(
    (t: TemplateType) => IMPLICIT_TEMPLATE_TYPES.indexOf(t) === -1
  ) as CustomElementsType[]
}

const calcHoverPosition = (
  element: HTMLDivElement,
  container: HTMLDivElement | null
): {
  top?: number
  left?: number
} => {
  const rect = window
    .getSelection()
    ?.getRangeAt(0)
    ?.getBoundingClientRect()
  if (!rect) return {}
  // console.log(rect, element)
  const top = rect.top + window.pageYOffset - element.offsetHeight
  const centered = rect.left - element.offsetWidth / 2 + rect.width / 2
  const left = container
    ? Math.min(
        container.getBoundingClientRect().right - // right edge
          element.getBoundingClientRect().width,
        Math.max(
          container.getBoundingClientRect().left, // left edge
          centered
        )
      )
    : centered

  return {
    top,
    left
  }
}

export const ToolbarButton: React.FC<{
  button: ButtonI
  onClick: () => void
  disabled?: boolean
}> = ({ button, onClick, disabled }) => (
  <IconButton
    fillColorName={disabled ? 'textSoft' : 'text'}
    onMouseDown={event => {
      event.preventDefault()
      onClick()
    }}
    Icon={button.icon}
    size={button.small ? 12 : 19}
  />
)

const ToolbarButtons: React.FC<{
  marks: boolean
  inlines: CustomElementsType[]
  blocks: CustomElementsType[]
  formatting: string
}> = ({ marks, inlines, blocks, formatting }) => (
  <>
    {formatting === 'inline' && (
      <>
        {marks && <Marks />}
        {inlines.map(elKey => (
          <InsertButton key={elKey} elKey={elKey} />
        ))}
      </>
    )}
    {formatting === 'block' && (
      <>
        {blocks.map(elKey => (
          <InsertButton key={elKey} elKey={elKey} />
        ))}
      </>
    )}
  </>
)

export const Portal: React.FC<{ children: ReactElement }> = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

const Toolbar: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>
}> = ({ containerRef }) => {
  const [colorScheme] = useColorContext()
  const ref = useRef<HTMLDivElement>(null)
  const editor = useSlate()
  const [marks, setMarks] = useState(false)
  const [inlines, setInlines] = useState<CustomElementsType[]>([])
  const [blocks, setBlocks] = useState<CustomElementsType[]>([])
  const [formatting, setFormatting] = useState('inline')

  const reset = () => {
    setMarks(false)
    setInlines([])
    setBlocks([])
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    console.log({ marks, inlines, blocks })
    if (marks || inlines.length || blocks.length >= 2) {
      const { top, left } = calcHoverPosition(el, containerRef.current)
      el.style.opacity = '1'
      el.style.width = 'auto'
      el.style.height = 'auto'
      el.style.left = `${left}px`
      el.style.top = `${top}px`
    } else {
      el.removeAttribute('style')
    }
  }, [marks, inlines, blocks, ref.current, containerRef.current])

  useEffect(() => {
    const el = ref.current
    if (!el || !hasVisibleSelection(editor)) {
      el.removeAttribute('style')
      return reset()
    }
    const { text, element } = getCommonDirectAncestry(editor)
    console.log(text, element)
    const textNode = text && text[0]
    const elementNode = element && element[0]
    setFormatting(
      textNode &&
        Editor.string(editor, editor.selection) === textNode.placeholder
        ? 'block'
        : 'inline'
    )
    setMarks(showMarks(editor, textNode, elementNode))
    setInlines(getAllowedTypes(editor, textNode))
    // TODO: only show blocks when whole element is selected
    //  ...or not?
    setBlocks(getAllowedTypes(editor, elementNode))
  }, [editor.selection])

  return (
    <Portal>
      <div
        ref={ref}
        {...colorScheme.set('backgroundColor', 'overlay')}
        {...colorScheme.set('boxShadow', 'overlayShadow')}
        {...styles.hoveringToolbar}
      >
        <ToolbarButtons
          marks={marks}
          inlines={inlines}
          blocks={blocks}
          formatting={formatting}
        />
      </div>
    </Portal>
  )
}

export default Toolbar
