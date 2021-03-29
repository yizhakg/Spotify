import React, { useState, useEffect } from 'react'
import "./Home.css"
import SpotifyWebApi from "spotify-web-api-node"
import SlideFlex from '../../uiComponents/slideFlex/SlideFlex'
import TrackResults from '../../uiComponents/trackResults/TrackResults'

const spotifyApi = new SpotifyWebApi({
  clientId: "a730843ad65740449d795342bc50b8fb",
})

export default function Home({ accessToken, setPlayingTrack, setSearchResults }) {
  const [playlists, setPlaylists] = useState([])
  const [playlistDetails, setPlaylistDetails] = useState(null)
  const [playlistView, setPlaylistView] = useState([])

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

  // const choosePlaylist = (playlistId) => {
  //   spotifyApi.getPlaylistTracks(playlistId).then(res => {
  //     const playlistSongs = res.body.items.map(item => {
  //       const track = item.track
  //       const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
  //         if (image.height < smallest.height) return image;
  //         return smallest
  //       }, track.album.images[0])
  //       return {
  //         artist: track.artists.map(artist => artist.name).join(', '),
  //         title: track.name,
  //         uri: track.uri,
  //         albumUrl: smallestAlbumImage.url
  //       }
  //     })
  //     setSearchResults(playlistSongs)
  //     console.log(playlistSongs)
  //   })
  // }
  const choosePlaylist = (playlist) => {
    setPlaylistDetails(playlist)
    console.log(playlist);
    spotifyApi.getPlaylistTracks(playlist.playlistId).then(res => {
      const playlistSongs = res.body.items.map(item => {
        const track = item.track
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
      })
      setPlaylistView(playlistSongs);
    })
  }

  return (
    <div className="home">
      <div className="recently">
        <h2>Recently Played</h2>
        <SlideFlex playlists={playlists} choosePlaylist={choosePlaylist} />
      </div>
      {playlistView.length > 0 &&
        <div className="playlist">
          <div className="playlistDetails">
            <img className="playlistImage" src={playlistDetails.playlistImage} alt="" />
            <h1 className="playlistTitle">{playlistDetails.playlistName}</h1>
          </div>
          <div className="playlistView">
            {playlistView.map((track) => (
              <TrackResults track={track} chooseTrack={() => { }} key={track.uri} />
            ))}
          </div>
          <div className="playlistBtns">
            <button onClick={() => setPlayingTrack(playlistView)}>play</button>
            <button onClick={() => setPlaylistView([])}>Back</button>
          </div>
        </div>
      }
    </div>
  )
}
