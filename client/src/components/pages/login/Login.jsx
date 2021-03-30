import React from "react";
import "./Login.css"

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=a730843ad65740449d795342bc50b8fb&response_type=code&redirect_uri=http://localhost:4000/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
  return (
    <div className="login">
        <a className="login-btn" href={AUTH_URL}>Login With Spotify</a>
        <div className="headerLogo">
        <i className="fab fa-spotify"></i>
          <h1>Lyrics</h1>
      </div>
    </div>
  );
}
