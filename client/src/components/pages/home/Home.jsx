import React, { useState, useEffect } from 'react'
import "./Home.css"
import SpotifyWebApi from "spotify-web-api-node"
import SlideFlex from '../../uiComponents/slideFlex/SlideFlex'
import Player from "../../uiComponents/player/Player"

const spotifyApi = new SpotifyWebApi({
  clientId: "a730843ad65740449d795342bc50b8fb",
})

export default function Home({ accessToken }) {
  const [playlists, setPlaylists] = useState([])
  console.log(playlists)
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.searchPlaylists("XO").then(res => {
      setPlaylists(res.body.playlists.items.map(playlist => {
        // console.log(playlist)
        const biggestPlaylistImage = playlist.images.reduce((biggest, image) => {
          if (image.height > biggest.height) return image;
          return biggest
        }, playlist.images[0])
        return {
          playlistId: playlist.id,
          playlistName: playlist.name,
          playlistUri: playlist.uri,
          playlistImage: biggestPlaylistImage.url,
          playlistUrl: playlist.href,
        }
      }))
    })
  }, [accessToken])


  return (
    <div className="home">
      <div className="favorite">
        <SlideFlex item={playlists} />
      </div>
    </div>
  )
}
