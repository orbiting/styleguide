import React from 'react'
import colors from '../../../theme/colors'

export default ({ meta }) => {
  const { slug, path } = meta
  return (
    <tr>
      <td
        align='center'
        valign='top'
        style={{ borderBottom: `1px solid ${colors.divider}` }}
      >
        <a
          href={`https://www.republik.ch${path ? path : `/${slug}`}`}
          title='Im Web lesen'
        >
          <img
            height='79'
            src='https://www.republik.ch/static/logo_republik_newsletter.png'
            style={{
              border: 0,
              width: '180px !important',
              height: '79px !important',
              margin: 0,
              maxWidth: '100% !important'
            }}
            width='180'
            alt='REPUBLIK'
          />
        </a>
      </td>
    </tr>
  )
}
