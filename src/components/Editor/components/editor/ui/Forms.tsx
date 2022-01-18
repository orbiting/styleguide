import React, { ReactElement } from 'react'
import { CustomElement } from '../../../custom-types'
import { Editor, Transforms, Element as SlateElement } from 'slate'
import { config as elConfig } from '../../elements'
import { Overlay, OverlayBody, OverlayToolbar } from '../../../../Overlay'
import { ReactEditor, useSlate } from 'slate-react'
import { toTitle } from '../helpers/text'
import { Interaction } from '../../../../Typography'

export const FormOverlay = ({
  path,
  onClose
}: {
  path: number[]
  onClose: () => void
}): ReactElement => {
  const editor = useSlate()
  if (!path || path === []) return null

  // TODO: handle case where element has no form, but container element does
  const [element] = Editor.node(editor, path)
  if (!SlateElement.isElement(element)) return null

  const Form = elConfig[element.type].Form
  if (!Form) return null

  const onChange = (newProperties: Partial<CustomElement>) => {
    const path = ReactEditor.findPath(editor, element)
    Transforms.setNodes(editor, newProperties, { at: path })
  }
  return (
    <Overlay onClose={onClose}>
      <OverlayToolbar title='Edit' onClose={onClose} />
      <OverlayBody>
        <div>
          <Interaction.P>{toTitle(element.type)}</Interaction.P>
          <Form element={element} onChange={onChange} />
        </div>
      </OverlayBody>
    </Overlay>
  )
}
