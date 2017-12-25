import React from 'react'
import { imageResizeUrl } from 'mdast-react-render/lib/utils'

export const Lead = () => null

export const Title = () => null

export default ({ data: { src, alt }, children }) => {
  return (
    <tr>
      <td align='center' valign='top' className='cover'>
      <img
        src={imageResizeUrl(src, '1280x675')}
        alt={alt}
        border="0"
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          height: 'auto !important',
          maxWidth: '100% !important'
        }}
      />
      </td>
    </tr>
  )
}
