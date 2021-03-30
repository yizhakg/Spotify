import React, { useState, useContext } from 'react'

const SpotifyContext = React.createContext()
const SpotifyUpdate = React.createContext()

export function usePlayPosition() {
  return useContext(SpotifyContext)
}
export function useSetPlayPosition() {
  return useContext(SpotifyUpdate)
}




export function SpotifyProvider({ children }) {
  const [start, setStart] = useState(0)
  const updateStart = (updatePoint) => {
    setStart(updatePoint)
  }
  return (
    <SpotifyContext.Provider value={start}>
      <SpotifyUpdate.Provider value={updateStart}>
        {children}
      </SpotifyUpdate.Provider>
    </SpotifyContext.Provider>
  )
}
