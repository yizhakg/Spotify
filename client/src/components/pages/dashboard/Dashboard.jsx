import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import useAuth from '../../../services/useAuth'
import SpotifyWebApi from "spotify-web-api-node"
import TrackResults from "../../uiComponents/trackResults/TrackResults"
import Player from "../../uiComponents/player/Player"
import { useSetPlayPosition } from "../../../services/SpotifyContext"

const spotifyApi = new SpotifyWebApi({
  clientId: "a730843ad65740449d795342bc50b8fb",

})

export default function Dashboard({ code, setToken, playingTrack, setPlayingTrack, searchResults, setSearchResults }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const setPlayPosition = useSetPlayPosition();

  const chooseTrack = (track) => {
    setPlayPosition(0)
    setPlayingTrack(track)
    setSearch("")
  }
  const handleSearchBlur = (e) => {
    setTimeout(() => {
      setSearch("");
      setSearchResults([]);
    }, 500);
  }

  useEffect(() => {
    if (!accessToken) return;
    setToken(accessToken);
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken, setToken])

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    let cancel = false;

    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return;
      setSearchResults(res.body.tracks.items.map(track => {
        // console.log(track)
        const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
          if (image.height < smallest.height) return image;
          return smallest
        }, track.album.images[0])
        return {
          artist: track.artists.map(artist => artist.name).join(', '),
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url,
          id: track.id
        }
      }))
    })

    return () => cancel = true;

  }, [search, accessToken, setSearchResults])

  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="searchBox">
          <input id="search" type="search" value={search} className="search" placeholder=" Search Song/Artists" onBlur={handleSearchBlur} onChange={(e) => setSearch(e.target.value)} />
          <label htmlFor="search"><i className="fas fa-search"></i></label>
        </div>

        <div className="results">
          {searchResults.map((track) => (
            <TrackResults track={track} chooseTrack={chooseTrack} key={track.uri} />
          ))}
        </div>
      </div>

      <Player accessToken={accessToken} playingTrack={playingTrack} />
    </React.Fragment>
  )
}
