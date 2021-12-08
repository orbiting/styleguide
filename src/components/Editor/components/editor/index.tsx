import React, { PropsWithChildren, useCallback, useMemo } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, withReact } from 'slate-react'
import { config as elementsConfig } from '../elements'
import { FixedToolbar, HoveringToolbar } from './ui/Toolbar'
import { EditableElement } from './ui/Edit'
import { LeafComponent } from './Mark'
import {
  withBreaksDisabled,
  withElAttrsConfig,
  withNormalizations,
  withTemplate
} from './Element'
import { CustomDescendant, CustomElement } from '../../custom-types'
import { withCharLimit } from './ui/CharCount'

const Editor: React.FC<{
  value: CustomDescendant[]
  setValue: (t: CustomDescendant[]) => void
}> = ({ value, setValue }) => {
  const editor = useMemo(
    () =>
      //withTemplate(value as CustomElement[])(
      withCharLimit(
        withNormalizations(
          withBreaksDisabled(
            withElAttrsConfig(withReact(withHistory(createEditor())))
          )
        )
        //  )
      ),
    []
  )
  const containerRef = React.useRef<HTMLDivElement>(null)

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
