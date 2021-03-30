import React, { useState, useEffect } from 'react'
import "./Home.css"
import SpotifyWebApi from "spotify-web-api-node"
import SlideFlex from '../../uiComponents/slideFlex/SlideFlex'
import TrackResults from '../../uiComponents/trackResults/TrackResults'
import { useSetPlayPosition } from "../../../services/SpotifyContext"

const spotifyApi = new SpotifyWebApi({
  clientId: "a730843ad65740449d795342bc50b8fb",
})

export default function Home({ accessToken, setPlayingTrack }) {
  const [recommendations, setRecommendations] = useState([])
  const [userPlaylists, setUserPlaylists] = useState([])
  const [moreLikeOne, setMoreLikeOne] = useState([])
  const [moreLikeTwo, setMoreLikeTwo] = useState([])
  const [moreLikeThree, setMoreLikeThree] = useState([])
  const [playlistDetails, setPlaylistDetails] = useState(null)
  const [playlistView, setPlaylistView] = useState([])
  const [activeId, setActiveId] = useState("")
  const setPlayPosition = useSetPlayPosition()


  const choosePlaylist = (playlist) => {
     setPlaylistDetails(playlist)
    playlist.playlistUrl ?
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
      :
      spotifyApi.getAlbumTracks(playlist.playlistId).then(res => {
        console.log(res)
        const playlistSongs = res.body.items.map(track => {
          return {
            artist: track.artists.map(artist => artist.name).join(', '),
            title: track.name,
            uri: track.uri,
            albumUrl: playlist.playlistImage,
            id: track.id
          }
        })
        setPlaylistView(playlistSongs);
        activeId && document.getElementById(activeId)?.classList.add("active")
      })
  }
  const chooseTrack = async (startFrom) => {
    setPlayPosition(startFrom)
    setPlayingTrack(playlistView)
  }
  const handlePlaylistClose = () => {
    const id = document.querySelector(".active")?.id;
    id && setActiveId(id)
    setPlaylistView([]);
  }
  const handlePlayThis = () => {
    setPlayPosition(0);
    setPlayingTrack(playlistView)
  }
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    const client = spotifyApi.getMe().then(res => res.body).then(res => {
      console.log(res)
    })

    spotifyApi.searchPlaylists("hip hop").then(res => {
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
    spotifyApi.getFeaturedPlaylists({ country: client.country }).then(res => {
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
    spotifyApi.getPlaylistsForCategory('party', {
      country: client.country,
      offset: 0
    }).then(res => {
      setMoreLikeTwo(res.body.playlists.items.map(playlist => {
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

    spotifyApi.getMySavedAlbums().then(res => {
      setMoreLikeThree(res.body.items.map(album => {
        const biggestPlaylistImage = album.album.images.reduce((biggest, image) => {
          if (image.height > biggest.height) return image;
          return biggest
        }, album.album.images[0])
        return {
          playlistId: album.album.id,
          playlistName: album.album.name,
          playlistUri: album.album.uri,
          playlistImage: biggestPlaylistImage.url,
        }
      }))
    })
    spotifyApi.getMySavedAlbums().then(res => { console.log(res) })

  }, [accessToken])


  return (
    <div className="home">
      <div className="showLine">
        <h2>Recommendations</h2>
        <SlideFlex playlists={recommendations} choosePlaylist={choosePlaylist} id="recommendations" />
      </div>
      <div className="showLine">
        <h2>Top In Your Country</h2>
        <SlideFlex playlists={moreLikeOne} choosePlaylist={choosePlaylist} id="topCountry" />
      </div>
      <div className="showLine">
        <h2>More To Like</h2>
        <SlideFlex playlists={moreLikeTwo} choosePlaylist={choosePlaylist} id="moreToLike" />
      </div>
      <div className="showLine">
        <h2>Favorite Albums</h2>
        <SlideFlex playlists={moreLikeThree} choosePlaylist={choosePlaylist} id="favoriteAlbums" />
      </div>
      <div className="showLine">
        <h2>Favorites</h2>
        <SlideFlex playlists={userPlaylists} choosePlaylist={choosePlaylist} id="favorites" />
      </div>
      {playlistView.length > 0 &&
        <div className="playlist">
          <div className="playlistDetails">
            <img className="playlistImage" src={playlistDetails.playlistImage} alt="" />
            <h1 className="playlistTitle">{playlistDetails.playlistName}</h1>
          </div>
          <div className="playlistView">
            {playlistView.map((track, i) => (
              <TrackResults track={track} chooseTrack={() => chooseTrack(i)} key={i} />
            ))}
          </div>
          <div className="playlistBtns">
            <button className="flexBtn" onClick={handlePlayThis}><i className="fas fa-play"></i></button>
            <button className="flexBtn" onClick={handlePlaylistClose}><i className="fas fa-undo"></i></button>
          </div>
        </div>
      }
    </div>
  )
}
