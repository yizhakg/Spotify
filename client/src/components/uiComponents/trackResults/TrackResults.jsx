import React from 'react'
import "./TrackResults.css"
export default function TrackResults({track,chooseTrack}) {
  const handlePlay=()=>{
    chooseTrack(track)
  }
  return (
    <div className="trackCard" onClick={handlePlay}>
      <img src={track.albumUrl} alt=""/>
      <div className="trackInfo">
        <h3 class="trackTitle">{track.title}</h3>
        <h5 class="trackArtist">{track.artist}</h5>
      </div>
    </div>
  )
}
