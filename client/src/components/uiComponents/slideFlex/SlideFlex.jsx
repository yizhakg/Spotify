import React, { useEffect } from 'react'
import "./SlideFlex.css"

export default function SlideFlex({ item }) {
  const handleClick = (e) => {
    const ele = document.getElementById("slide")
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
    document.getElementById("slide").onmousemove = null
  }

  const Slides = item.map((playlist, i) => {
    return <div key={`div${i}`} className="playlistImg" >
      < img src={playlist.playlistImage} alt="" />
    </div>
  })
  // const Slides = item.map((playlist, i) => {
  //   const style = {
  //     backgroundImage:`url(${playlist.playlistImage})`
  //   }
  //   return <div key={`img${i}`} className="playlistImg" style={style} alt="" onMouseDown={handleClick} onMouseUp={handleUp}></div>
  // })


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
