import React from 'react'
import "./SlideFlex.css"

export default function SlideFlex({ playlists, choosePlaylist,id }) {

  const handleDown = (e) => {
    const ele = document.getElementById(id)
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
    document.getElementById(id).onmousemove = null
  }

  const Slides = playlists.map((playlist, i) => {
    return <div key={`div${i}`} className="playlistBox" >
      < img src={playlist.playlistImage} alt="" />
      <button className="flexBtn" onClick={()=>choosePlaylist(playlist)}><i className="fas fa-play"></i></button>
    </div>
  })

  return (

    <React.Fragment>
      <div className="slide-wrapper" >
        <div className="slide" id={id} onMouseDown={handleDown} onMouseUp={handleUp}>
          {Slides}
        </div>
      </div>
    </React.Fragment>


  )
}
