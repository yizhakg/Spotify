import React, { useState } from 'react'
import { Route, Switch } from "react-router-dom";
import Login from "../components/pages/login/Login"
import Dashboard from "../components/pages/dashboard/Dashboard"
import Home from '../components/pages/home/Home';

const code = new URLSearchParams(window.location.search).get('code')

export default function SpotifyRouter() {

  const [token, setToken] = useState("")
  const [playingTrack, setPlayingTrack] = useState();
  const [searchResults, setSearchResults] = useState([]);
  return (
    <React.Fragment>
      <Switch>
        <Route path="/dashboard">
          <Home
            accessToken={token}
            setPlayingTrack={setPlayingTrack}
            setSearchResults={setSearchResults}
          />
        </Route>
      </Switch>
      <Route path="/">
        {code ? <Dashboard
          code={code}
          setToken={setToken}
          playingTrack={playingTrack}
          setPlayingTrack={setPlayingTrack}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
        /> : <Login />}
      </Route>
    </React.Fragment>
  )
}
