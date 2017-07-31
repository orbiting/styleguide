import {getJson} from './env'

const colors = {
  primary: '#00508C',
  primaryBg: '#BFE1FF',
  secondary: '#00335A',
  secondaryBg: '#D8EEFF',
  disabled: '#B8BDC1',
  text: '#191919',
  error: '#9E0041',
  divider: '#DBDCDD',
  ...getJson('COLORS')
}

export default colors
