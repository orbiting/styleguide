import React, { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, withReact } from 'slate-react'
import { withNormalizations } from './decorators/normalization'
import { withElAttrsConfig } from './decorators/attrs'
import { config as elementsConfig } from '../elements'
import { FixedToolbar, HoveringToolbar } from './ui/Toolbar'
import { EditableElement } from './ui/Edit'
import { LeafComponent } from './Mark'
import {
  CustomDescendant,
  CustomEditor,
  CustomElement,
  NodeTemplate
} from '../../custom-types'
import { withCharLimit } from './ui/CharCount'
import { markAllDirty } from './helpers/tree'

const Editor: React.FC<{
  value: CustomDescendant[]
  setValue: (t: CustomDescendant[]) => void
  structure?: NodeTemplate[]
}> = ({ value, setValue, structure }) => {
  const editorRef = useRef<CustomEditor>()
  if (!editorRef.current) {
    editorRef.current = withCharLimit(
      withNormalizations(structure)(
        withElAttrsConfig(withReact(withHistory(createEditor())))
      )
    )
  }
  const editor = editorRef.current
  const containerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a workaround to trigger a normalization cycle over
    // the whole tree, so that the desired structure gets applied.
    markAllDirty(editor)
  }, [])

  const RenderedElement: React.FC<PropsWithChildren<{
    element: CustomElement
  }>> = props => {
    const Component = elementsConfig[props.element.type].Component
    return (
      <EditableElement element={props.element}>
        <Component {...props} />
      </EditableElement>
    )
  }

  const renderElement = useCallback(RenderedElement, [])

  const renderLeaf = useCallback(
    ({ children, ...props }) => (
      <LeafComponent {...props}>{children}</LeafComponent>
    ),
    []
  )

  return (
    <div ref={containerRef}>
      <Slate
        editor={editor}
        value={value}
        onChange={newValue => setValue(newValue)}
      >
        <HoveringToolbar containerRef={containerRef} />
        <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
        <FixedToolbar />
      </Slate>
    </div>
  )
}

export default Editor
