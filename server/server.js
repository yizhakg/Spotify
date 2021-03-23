const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const lyricsFinder = require("lyrics-finder");
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`spotify server up with port: ${PORT}`);
});
//server up get check
app.get("/", (req, res) => {
  res.send("welcome to spotify clone server");
});
//get lyrics route
app.get("/lyrics", async (req, res) => {
  let artist = req.query.artist;
  let track = req.query.track
 if(artist.indexOf("(")!=-1){
   const index = artist.indexOf("(");
  artist = artist.substring(0,index)
 }
 if(track.indexOf("(")!=-1){
   const index = track.indexOf("(");
   track = track.substring(0,index)
 }
   const lyrics = await lyricsFinder(artist,track );
  res.json({ lyrics });
});
//post login info route
app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((error) => {
      res.sendStatus(400);
    });
});
//post refresh token route
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log("hi");
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});
