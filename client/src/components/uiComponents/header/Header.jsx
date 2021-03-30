import React from 'react'
import "./Header.css"

export default function Header() {
  return (
    <div className="header">
     <img className="headerImg" src="./headerImg.png" alt="" onClick={()=>{
         window.location = "/";
     }}/>
    </div>
  )
}
