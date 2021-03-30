import React, { useEffect, useState } from 'react'
import "./Player.css"
import SpotifyPlayer from 'react-spotify-web-playback';
import axios from 'axios'
import { usePlayPosition } from "../../../services/SpotifyContext"

export default function Player({ accessToken, playingTrack }) {
  const [play, setPlay] = useState(false)
  const [currentTrack, setCurrentTrack] = useState()
  const [lyrics, setLyrics] = useState("");
  const [showLyrics, setShowLyrics] = useState(false);
  const playPosition = usePlayPosition();

  useEffect(() => {
    if (!currentTrack) return;
    axios.get('http://localhost:4001/lyrics', {
      params: {
        track: currentTrack.title,
        artist: currentTrack.artist,
      }
    }).then((res) => {
      setLyrics(res.data.lyrics)
    })
  }, [currentTrack])


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
    // console.log(state);
    if (!state.isPlaying) setPlay(false)
    currentTrack?.id && document.getElementById(currentTrack.id)?.classList.remove("active")
    setCurrentTrack({
      id: state.track.id,
      artist: state.track.artists,
      title: state.track.name,
    })
  }

  useEffect(() => {
    setPlay(true)
  }, [playingTrack])

  useEffect(() => {
    if (!currentTrack) return;
    if (!currentTrack.id) return;
    document.getElementById(currentTrack.id)?.classList.add("active")
  })

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
        offset={playPosition}
      />
      {lyrics && <button className="lyrics-btn" onClick={() => setShowLyrics((isShow) => !isShow)}>Lyrics {showLyrics ? <i className="fas fa-times"></i> : <i className="fas fa-plus"></i>}</button>}
      {showLyrics && (
        <div className="lyrics">
          {currentTrack && <div className="lyricTitle">
            <h1>{currentTrack.title}</h1>
            <h2>{currentTrack.artist}</h2>
          </div>}
          {lyrics && <div className="lyricWords">{lyrics}</div>}
        </div>
      )}
    </div>
  )
}
