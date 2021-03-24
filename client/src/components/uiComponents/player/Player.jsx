import React, { useEffect, useState } from 'react'
import "./Player.css"
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ accessToken, trackUri }) {

  const [play, setPlay] = useState(false)
  const playerStyle = {
    activeColor: '#1db954',
    bgColor: 'transparent',
    color: '#F4F7F5',
    loaderColor: '#1db954',
    sliderColor: '#1aa34a',
    trackArtistColor: '#b3b3b3',
    sliderHandleColor:'#1ed760',
    trackNameColor: '#fff',

  }
  useEffect(() => {
    setPlay(true)
  }, [trackUri])

  if (!accessToken) return null
  return (
    <div className="player">
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon={true}
        play={play}
        callback={state => {
          if (!state.isPlaying) setPlay(false)
        }}
        uris={trackUri ? [trackUri] : []}
        styles={playerStyle}
      />
    </div>
  )
}
