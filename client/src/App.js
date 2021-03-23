import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import SpotifyRouter from "./services/SpotifyRouter";

function App() {
  return (
    <Router>
      <div className="App">
        <SpotifyRouter/>
      </div>
    </Router>
  );
}

export default App;
