import React, { ReactElement } from 'react'
import {
  CustomEditor,
  CustomElement,
  ElementFormProps
} from '../../../custom-types'
import { Editor, Transforms, Element as SlateElement } from 'slate'
import { config as elConfig } from '../../elements'
import { Overlay, OverlayBody, OverlayToolbar } from '../../../../Overlay'
import { ReactEditor, useSlate } from 'slate-react'
import { toTitle } from '../helpers/text'
import { Interaction } from '../../../../Typography'
import { css } from 'glamor'

const styles = {
  elementTitle: css({
    marginBottom: 5
  }),
  elementForm: css({
    marginBottom: 20
  })
}

type FormData = {
  Form: React.FC<ElementFormProps<CustomElement>>
  element: CustomElement
}

const getForm = (
  editor: CustomEditor,
  path: number[]
): FormData | undefined => {
  const element = Editor.node(editor, path)[0]
  if (!SlateElement.isElement(element)) return
  const Form = elConfig[element.type].Form
  if (!Form) return
  return {
    element,
    Form
  }
}

const getForms = (editor: CustomEditor, path: number[]): FormData[] =>
  path
    .reduce((forms, p, i) => {
      const currentPath = path.slice(0, i ? -i : undefined)
      const currentForm = getForm(editor, currentPath)
      return forms.concat(currentForm)
    }, [])
    .filter(Boolean)

export const FormOverlay = ({
  path,
  onClose
}: {
  path: number[]
  onClose: () => void
}): ReactElement => {
  const editor = useSlate()
  if (!path || path === []) return null

  const forms = getForms(editor, path)
  if (!forms.length) return null

  return (
    <Overlay onClose={onClose}>
      <OverlayToolbar title='Edit' onClose={onClose} />
      <OverlayBody>
        {forms.map(({ Form, element }, i) => (
          <div key={i} {...styles.elementForm}>
            <div {...styles.elementTitle}>
              <Interaction.P>{toTitle(element.type)}</Interaction.P>
            </div>
            <Form
              element={element}
              onChange={(newProperties: Partial<CustomElement>) => {
                const path = ReactEditor.findPath(editor, element)
                Transforms.setNodes(editor, newProperties, { at: path })
              }}
            />
          </div>
        ))}
      </OverlayBody>
    </Overlay>
  )
}
