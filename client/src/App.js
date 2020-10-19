import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const API_KEY = 'AIzaSyDvUMWwW68tbW1ZE-n5N6vambE7scSpNb0';

let artistArray = [];
let songArray = [];
let artist;
let songTitle;

class App extends Component {
  constructor(props){
    super(props);
    const params = this.getHashParams();
    const token = 'BQDZ22puwAFo34y8JNR_AlJtAFcKeDVn3ZSm4oVjHjqfYgQAEgZHOeKpWiIUrQEcf7iEaZg4n9qDhnLRZAupn-5GB_S1Krgjaf8wA60cXbNVQnRqcU3XFbdpA1MEiK5TvEojFcon3dlg3oCUNwrp68ab1n_WRDvOqCR8oQEZOLmDSjeJGdDsSVL-VxpOF5tTpk_MtrxAjngiJGMAqlrTUVuAuWrwSQ4qBgzt6x4wAsDzMr4SiI3DgnQ-nLpVsewM9X61UuFG3YWUgKNM0mV5mXe-JYilsOZ9pj8Y7LM';
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      resultyt: []
    };
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getYoutubePlaylistItems(){
    fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId=PLKdm3xMOFF6pXX5U7FaBORxo3dOUSp63F&key=${API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
        for(let i=0; i<json.items.length;i++){
          artist = json.items[i].snippet.title
          .replace(/ *\([^)]*\) */g, "")
          .replace(/ *\[[^\]]*]/, '').match("^[^-]*[^ -]");
          artistArray.push(artist);

          songTitle = json.items[i].snippet.title
          .replace(/ *\([^)]*\) */g, "")
          .replace(/ *\[[^\]]*]/, '')
          .match("[^ -][^-]*$");
          
          songArray.push(songTitle);

          spotifyApi.searchTracks(`${artist} ${songTitle} `)
          .then(function(data) {
            if( data !== false){
              console.log(data.tracks.items[0].uri); 
              spotifyApi.addTracksToPlaylist('6s59wy7bfv4eg8v6o5wx7xlgt','2xbQtWVN8U5TV28XOcXRK4',['spotify:track:'+`${data.tracks.items[0].id}`]).then(
                console.log()
              )
            }
            
          }
          , function(err) {
            console.error(err);
          });
          
          
        }
    })
    .catch((error) => {
      console.error(error);
    });
}



  render() {
    return (
      <div className="App">
        <a href='http://localhost:3003' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        {/* <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div> */}
        { this.state.loggedIn &&
        <div>
          <button onClick={this.getYoutubePlaylistItems}>
            YOutube Playlist items
          </button>
          </div>
        }
        
      </div>
    );
  }
}

export default App;