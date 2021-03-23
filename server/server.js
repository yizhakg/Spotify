const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("spotify server up");
});
app.get("/", (req, res) => {
  res.send("welcome to spotify clone server");
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:4000/",
    clientId: "a730843ad65740449d795342bc50b8fb",
    clientSecret: "30946057c033428bb19904387e031479",
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

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log("hi")
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:4000/",
    clientId: "a730843ad65740449d795342bc50b8fb",
    clientSecret: "30946057c033428bb19904387e031479",
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
      console.log(error)
      res.sendStatus(400);
    });
});
