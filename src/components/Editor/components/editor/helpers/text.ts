export const toTitle = (text = ''): string =>
  text.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())
