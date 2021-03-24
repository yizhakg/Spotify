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

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [showLyrics, setShowLyrics] = useState(true);

  const chooseTrack = (track) => {
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }
  console.log(playingTrack)
  const handleSearchBlur = (e) => {
    console.log(e.target.value);
    setTimeout(() => {
      setSearch("");
      setSearchResults([]);
    }, 500);
  }
  useEffect(() => {
    if (!playingTrack) return;
    console.log(playingTrack)
    axios.get('http://localhost:4001/lyrics', {
      params: {
        track: playingTrack.title,
        artist: playingTrack.artist
      }
    }).then((res) => {
      setLyrics(res.data.lyrics)
    })
  }, [playingTrack])

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
      <div className="searchBox">
        <input id="search" type="search" value={search} className="search" placeholder=" Search Song/Artists" onBlur={handleSearchBlur} onChange={(e) => setSearch(e.target.value)} />
        <label htmlFor="search"><i className="fas fa-search"></i></label>
        {lyrics && <button className="lyrics-btn" onClick={() => setShowLyrics((isShow) => !isShow)}>Lyrics {showLyrics ? <i class="fas fa-times"></i> : <i class="fas fa-plus"></i>}</button>}
      </div>

      <div className="results">
        {searchResults.map((track) => (
          <TrackResults track={track} chooseTrack={chooseTrack} key={track.uri} />
        ))}
        {searchResults.length === 0 && showLyrics && (
          <div className="lyrics">
            {playingTrack && <div className="lyricTitle">
              <h1>{playingTrack.title}</h1>
              <h2>{playingTrack.artist}</h2>
            </div>}
            <div className="lyricWords">{lyrics}</div>
          </div>
        )}
      </div>

      <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
    </div>
  )
}
