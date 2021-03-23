import React from 'react'
import "./TrackResults.css"
export default function TrackResults({track,chooseTrack}) {
  const handlePlay=()=>{
    chooseTrack(track)
  }
  return (
    <div className="trackCard" onclick={handlePlay}>
      <img src={track.albumUrl} alt=""/>
      <div className="trackInfo">
        <h3>{track.title}</h3>
        <h5>{track.artist}</h5>
      </div>
    </div>
  )
}
