import React, { PropsWithChildren, useCallback, useEffect } from 'react'
import { createEditor, Editor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, withReact } from 'slate-react'
import { withNormalizations } from './decorators/normalization'
import { withElAttrsConfig } from './decorators/attrs'
import { config as elementsConfig } from '../elements'
import { FixedToolbar, HoveringToolbar } from './ui/Toolbar'
import { LeafComponent } from './Mark'
import {
  CustomDescendant,
  CustomEditor,
  CustomElement,
  NodeTemplate
} from '../../custom-types'
import { withCharLimit } from './ui/CharCount'
import { navigateOnTab } from './helpers/tree'
import { handleStructure } from './helpers/structure'
import { useMemoOne } from 'use-memo-one'

const SlateEditor: React.FC<{
  value: CustomDescendant[]
  setValue: (t: CustomDescendant[]) => void
  structure?: NodeTemplate[]
}> = ({ value, setValue, structure }) => {
  const editor = useMemoOne<CustomEditor>(
    () =>
      withCharLimit(
        withNormalizations(structure)(
          withElAttrsConfig(withReact(withHistory(createEditor())))
        )
      ),
    []
  )
  const containerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    Editor.normalize(editor, { force: true })
  }, [])

  const RenderedElement: React.FC<PropsWithChildren<{
    element: CustomElement
  }>> = props => {
    const Component = elementsConfig[props.element.type].Component
    return <Component {...props} />
    /*return (
      <EditableElement element={props.element}>
        <Component {...props} />
      </EditableElement>
    )*/
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
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            handleStructure(editor, event)
            navigateOnTab(editor, event)
          }}
        />
        <FixedToolbar />
      </Slate>
    </div>
  )
}

export default SlateEditor
