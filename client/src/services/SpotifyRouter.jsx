import React from 'react'
import { Route, Switch } from "react-router-dom";
import Login from "../components/pages/login/Login"
import Dashboard from "../components/pages/dashboard/Dashboard"

const code = new URLSearchParams(window.location.search).get('code')

export default function SpotifyRouter() {
  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/">
          {code ? <Dashboard code={code} /> : <Login />}
        </Route>
      </Switch>
    </React.Fragment>
  )
}
