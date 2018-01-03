import React from 'react'
import { fontFamilies } from '../../../theme/fonts'
import { paragraphStyle } from './Paragraph'
import { Mso } from 'mdast-react-render/lib/email'

export default ({ children, meta }) => {
  const { slug } = meta
  return (
    <tr>
      <td align="center" valign="top">
        <Mso>
          {`
      <table cellspacing="0" cellpadding="0" border="0" width="600">
        <tr>
          <td>
        `}
        </Mso>
        <table
          align="center"
          border="0"
          cellPadding="0"
          cellSpacing="0"
          width="100%"
          style={{
            maxWidth: 600,
            color: '#000',
            fontSize: 19,
            fontFamily: fontFamilies.serifRegular
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: 20 }} className="body_content">
                {children}
              </td>
            </tr>
            <tr>
              <td style={{ padding: 20 }}>
                <a href="https://www.republik.ch/">
                  <img
                    height="79"
                    src="https://assets.project-r.construction/images/logo_republik_newsletter.png"
                    style={{
                      border: 0,
                      width: '180px !important',
                      height: '79px !important',
                      margin: 0,
                      maxWidth: '100% !important'
                    }}
                    width="180"
                    alt=""
                  />
                </a>
                <p style={{ ...paragraphStyle, marginTop: 0 }}>
                  Republik AG<br />
                  Sihlhallenstrasse 1<br />
                  8004 Zürich
                </p>
                <hr />
                <p>
                  <a
                    href={`https://www.republik.ch/${slug}`}
                    style={{
                      color: '#000',
                      fontFamily: fontFamilies.sansSerifRegular,
                      fontSize: '15px'
                    }}
                  >
                    Im Web lesen
                  </a>
                  {' · '}
                  <a
                    href="*|UNSUB|*"
                    style={{
                      color: '#000',
                      fontFamily: fontFamilies.sansSerifRegular,
                      fontSize: '15px'
                    }}
                  >
                    Vom Newsletter abmelden
                  </a>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <Mso>
          {`
      </td>
    </tr>
  </table>
        `}
        </Mso>
      </td>
    </tr>
  )
}
