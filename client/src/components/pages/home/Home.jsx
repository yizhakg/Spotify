import React, { useState, useEffect } from 'react'
import "./Home.css"
import SpotifyWebApi from "spotify-web-api-node"
import SlideFlex from '../../uiComponents/slideFlex/SlideFlex'
import TrackResults from '../../uiComponents/trackResults/TrackResults'
import axios from 'axios'
const spotifyApi = new SpotifyWebApi({
  clientId: "a730843ad65740449d795342bc50b8fb",
})

export default function Home({ accessToken, setPlayingTrack }) {
  const [recommendations, setRecommendations] = useState([])
  const [userPlaylists, setUserPlaylists] = useState([])
  const [moreLikeOne, setMoreLikeOne] = useState([])
  const [moreLikeTwo, setMoreLikeTwo] = useState([])
  const [playlistDetails, setPlaylistDetails] = useState(null)
  const [playlistView, setPlaylistView] = useState([])
  const [activeId, setActiveId] = useState("")

  const choosePlaylist = (playlist) => {
    setPlaylistDetails(playlist)
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
      activeId && document.getElementById(activeId)?.classList.add("active")
    })
  }

  const handlePlaylistClose = () => {
    const id = document.querySelector(".active")?.id;
    id && setActiveId(id)
    setPlaylistView([]);
  }

  useEffect(async () => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    const client = await spotifyApi.getMe().then(res => res.body)
    console.log(client)
    spotifyApi.getFeaturedPlaylists().then(res => {
      setRecommendations(res.body.playlists.items.map(playlist => {
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

    spotifyApi.getUserPlaylists().then(res => {
      setUserPlaylists(res.body.items.map(playlist => {
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
    spotifyApi.getFeaturedPlaylists({country: client.country}).then(res => {
      setMoreLikeOne(res.body.playlists.items.map(playlist => {
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
      <div className="showLine">
        <h2>Recommendations</h2>
        <SlideFlex playlists={recommendations} choosePlaylist={choosePlaylist} id="recommendations"/>
      </div>
      <div className="showLine">
        <h2>Favorites</h2>
        <SlideFlex playlists={userPlaylists} choosePlaylist={choosePlaylist} id="favorites"/>
      </div>
      <div className="showLine">
        <h2>Top In Your Country</h2>
        <SlideFlex playlists={moreLikeOne} choosePlaylist={choosePlaylist} id="topCountry"/>
      </div>
      {playlistView.length > 0 &&
        <div className="playlist">
          <div className="playlistDetails">
            <img className="playlistImage" src={playlistDetails.playlistImage} alt="" />
            <h1 className="playlistTitle">{playlistDetails.playlistName}</h1>
          </div>
          <div className="playlistView">
            {playlistView.map((track,i) => (
              <TrackResults track={track} chooseTrack={() => { }} key={i} />
            ))}
          </div>
          <div className="playlistBtns">
            <button className="flexBtn" onClick={() => setPlayingTrack(playlistView)}><i className="fas fa-play"></i></button>
            <button className="flexBtn" onClick={handlePlaylistClose}><i className="fas fa-undo"></i></button>
          </div>
        </div>
      }
    </div>
  )
}
