import React, { useEffect } from 'react'
import "./SlideFlex.css"

export default function SlideFlex({ item }) {

  const Slides = item.map((playlist, i) => {
    return < img key={`img${i}`} className="playlistImg" src={playlist.playlistImage} alt="" />
  })
  const handleClick = (e) => {
    e.target.onmousedown = (event) => {
      event.target.onmousemove = (event2) => {
        console.log(event2)
      }
    }
    e.target.onmouseup = (event) => {
      event.target.onmousemove = null

    }
    e.target.onmousemove = null


  }


  return (

    <React.Fragment>
      <div className="slide-wrapper" onMouseEnter={handleClick}>
        <div className="slide">
          {Slides}
        </div>
      </div>
    </React.Fragment>


  )
}
