import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Landing.css';
import {Button} from 'react-bootstrap';

export default class Landing extends React.Component {

  render() {
    return (
      <div className="landing">
        <div className="container midddle">
          <div className="spotifyWords">
            <h1 style={{textAlign: "center"}}> Welcome to <b>Spotify.Smarter</b></h1>
            <br></br>
            <h5 style={{textAlign: "center"}}> Learn more about the music you listen to and get recommendations to expand your musical options. </h5> 
            <h5 style={{textAlign: "center"}}>Login to Spotify.Smarter to see all of your playlists and to find out more about your songs and playlists</h5>
          </div>
          <div className="buttonWrap">
            <Button className="border border-dark" style={{borderRadius: '15px', width: '200px', backgroundColor: '#1DB954'}} size="lg" href="http://localhost:8081/login">
              Login with Spotify
            </Button>
          </div>
        </div>
        <p className="absolutelySucks">Made by Liam Hosey, Will Morgus, Lynne Raynor, and Anjali Mahwhhsswheri for CIS 450, Spring 2020</p>
      </div>
    );
  }
}