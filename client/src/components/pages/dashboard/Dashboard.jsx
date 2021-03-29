import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import useAuth from '../../../services/useAuth'
import SpotifyWebApi from "spotify-web-api-node"
import TrackResults from "../../uiComponents/trackResults/TrackResults"
import Player from "../../uiComponents/player/Player"
import axios from 'axios'

const spotifyApi = new SpotifyWebApi({
  clientId: "a730843ad65740449d795342bc50b8fb",

})

export default function Dashboard({ code, setToken, playingTrack, setPlayingTrack, searchResults, setSearchResults }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [showLyrics, setShowLyrics] = useState(false);

  const chooseTrack = (track) => {
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }
  const handleSearchBlur = (e) => {
    setTimeout(() => {
      setSearch("");
      setSearchResults([]);
    }, 500);
  }
  useEffect(() => {
    if (!playingTrack) return;
    axios.get('http://localhost:4001/lyrics', {
      params: {
        track: playingTrack.title || playingTrack[0].title,
        artist: playingTrack.artist || playingTrack[0].artist
      }
    }).then((res) => {
      setLyrics(res.data.lyrics)
    })
  }, [playingTrack])

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
          id:track.id
        }
      }))
    })

    return () => cancel = true;

  }, [search, accessToken, setSearchResults])
  useEffect(() => {
  }, [lyrics])
  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="searchBox">
          <input id="search" type="search" value={search} className="search" placeholder=" Search Song/Artists" onBlur={handleSearchBlur} onChange={(e) => setSearch(e.target.value)} />
          <label htmlFor="search"><i className="fas fa-search"></i></label>
          {lyrics && <button className="lyrics-btn" onClick={() => setShowLyrics((isShow) => !isShow)}>Lyrics {showLyrics ? <i className="fas fa-times"></i> : <i className="fas fa-plus"></i>}</button>}
        </div>

        <div className="results">
          {searchResults.map((track) => (
            <TrackResults track={track} chooseTrack={chooseTrack} key={track.uri} />
          ))}
        </div>
      </div>
      {showLyrics && (
        <div className="lyrics">
          {playingTrack && <div className="lyricTitle">
            <h1>{playingTrack.title || playingTrack[0].title}</h1>
            <h2>{playingTrack.artist || playingTrack[0].artist}</h2>
          </div>}
          {lyrics && <div className="lyricWords">{lyrics}</div>}
        </div>
      )}
      <Player accessToken={accessToken} playingTrack={playingTrack} />
    </React.Fragment>
  )
}
