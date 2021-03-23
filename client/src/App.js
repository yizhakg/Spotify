import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import SpotifyRouter from "./services/SpotifyRouter";
import Header from "./components/uiComponents/header/Header";

function App() {
  const style={
    background: 'url(./spotifyWallpaper.jpg)',
    backgroundSize: "cover",
    backgroundColor: "var(--black)",
  }
  return (
    <Router>
      <div className="App" style={style}>
        <Header/>
        <SpotifyRouter />
        
      </div>
    </Router>
  );
}

export default App;
