import React, { useContext } from 'react'

export const ProgressContext = React.createContext({
  getMediaProgress: () => {},
  saveMediaProgress: () => {},
  restoreArticleProgress: () => {}
})

export const useProgressContext = () => {
  const progressContext = useContext(ProgressContext)
  return [progressContext]
}
