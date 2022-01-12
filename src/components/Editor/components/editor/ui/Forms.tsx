import React, { Fragment } from 'react'
import { CustomDescendant, CustomElement } from '../../../custom-types'
import { Element as SlateElement } from 'slate'
import { config as elConfig } from '../../elements'

const DataForms: React.FC<{
  value: CustomDescendant[]
  setValue: (n: CustomDescendant[]) => void
}> = ({ value, setValue }) => {
  return (
    <div>
      {value.map((node, i) => {
        if (!SlateElement.isElement(node)) return null
        const DataForm = elConfig[node.type].DataForm
        const setElement = (element: CustomElement) =>
          setValue(value.map((n, j) => (j === i ? element : n)))
        return (
          <Fragment key={i}>
            {DataForm ? (
              <DataForm element={node} setElement={setElement} />
            ) : null}
            <DataForms
              value={node.children}
              setValue={n => setElement({ ...node, children: n })}
            />
          </Fragment>
        )
      })}
    </div>
  )
}

export default DataForms
