import React, { useEffect, useState } from 'react'
import "./Player.css"
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ accessToken, playingTrack }) {
  const [play, setPlay] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  let trackUri;
  if (playingTrack) {
    if (Array.isArray(playingTrack)) {
      trackUri = playingTrack.map(track => track.uri);
    } else {
      trackUri = [playingTrack.uri];
    }
  }
  const playerStyle = {
    activeColor: '#1db954',
    bgColor: 'transparent',
    color: '#F4F7F5',
    loaderColor: '#1db954',
    sliderColor: '#1aa34a',
    trackArtistColor: '#b3b3b3',
    sliderHandleColor: '#1ed760',
    trackNameColor: '#fff',

  }
  const handlePlayer = (state) => {
    console.log(state)
    if (!state.isPlaying) setPlay(false)
    if(!state.isPlaying) return
    if (currentTrack) currentTrack.classList.remove("active")
    document.getElementById(state.track.id).classList.add("active")
    setCurrentTrack(document.getElementById(state.track.id))
    console.log(currentTrack)
  }

  useEffect(() => {
    setPlay(true)
  }, [trackUri, currentTrack])

  if (!accessToken) return null
  return (
    <div className="player">
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon={true}
        play={play}
        callback={handlePlayer}
        uris={trackUri}
        styles={playerStyle}
      />
    </div>
  )
}
