import React from 'react'

import { DossierTag } from '../../components/Dossier'

import createArticleSchema from '../Article'

const DefaultLink = ({ children }) => children

const createSchema = ({
  dossierLabel = 'Dossier',
  dossierHref = '/dossier',
  customMetaFields = [],
  series = false,
  paynotes = true,
  Link = DefaultLink,
  titleBlockPrepend = null,
  getPath = ({ slug }) => `/dossier/${(slug || '').split('/').pop()}`,
  ...args
} = {}) => {
  return createArticleSchema({
    repoPrefix: 'dossier-',
    getPath,
    titleBlockPrepend: [
      titleBlockPrepend,
      <DossierTag attributes={{ contentEditable: false }}>
        {dossierLabel}
      </DossierTag>
    ],
    customMetaFields: [
      {
        label: 'Diskussion',
        key: 'discussion',
        ref: 'repo'
      },
      ...customMetaFields
    ],
    series,
    paynotes,
    Link,
    ...args
  })
}

export default createSchema
