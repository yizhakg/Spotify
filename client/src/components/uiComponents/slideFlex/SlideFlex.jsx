import React, { useEffect } from 'react'
import "./SlideFlex.css"

export default function SlideFlex({ item }) {

  const Slides = item.map((playlist, i) => {
    return < img key={`img${i}`} className="playlistImg" src={playlist.playlistImage} alt="" />
  })
  const handleClick = (e) => {
    const ele = e.target;
    const pos = {
      // The current scroll 
      left: ele.scrollLeft,
      // Get the current mouse position
      x: e.clientX,
    };

    const mouseMoveHandler = function (e) {
      // How far the mouse has been moved
      const dx = e.clientX - pos.x;

      // Scroll the element
      ele.scrollLeft = pos.left - dx;

    };

    ele.onmousemove = mouseMoveHandler
  }
  const handleUp = (e) => {
    e.target.onmousemove = null
  }


  return (

    <React.Fragment>
      <div className="slide-wrapper" >
        <div className="slide" id="slide" onMouseDown={handleClick} onMouseUp={handleUp}>
          {Slides}
        </div>
      </div>
    </React.Fragment>


  )
}
