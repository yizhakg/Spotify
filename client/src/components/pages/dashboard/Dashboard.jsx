import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import useAuth from '../../../services/useAuth'
import SpotifyWebApi from "spotify-web-api-node"
import TrackResults from "../../uiComponents/trackResults/TrackResults"

const spotifyApi = new SpotifyWebApi({
  clientId: "a730843ad65740449d795342bc50b8fb",

})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    let cancel = false;

    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return;
      setSearchResults(res.body.tracks.items.map(track => {
        const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
          if (image.height < smallest.height) return image;
          return smallest
        }, track.album.images[0])
        return {
          artist: track.artists.map(artist => artist.name).join(', '),
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url
        }
      }))
    })

    return () => cancel = true;

  }, [search, accessToken])

  return (
    <div className="dashboard">
      <input type="search" name="" className="search" placeholder=" &#xF002; Search Song/Artists" onChange={(e) => setSearch(e.target.value)} />
      <div className="results">
        {searchResults.map((track) => (
          <TrackResults track={track} key={track.uri} />
        ))}
      </div>
      <div className="bottom">
        bottom
      </div>
    </div>
  )
}
