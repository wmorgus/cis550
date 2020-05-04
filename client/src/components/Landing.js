import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Landing.css';
import {Button, ButtonGroup} from 'react-bootstrap';

export default class Landing extends React.Component {

  render() {
    return (
      <div className="landing">
        <div className="spotifyWords">
        <h1 style={{color: "white", textAlign: "center"}}> Welcome to Spotify.<span style={{color: "#22c3dd"}}>Smarter</span> </h1>
        <p style={{color: "white", textAlign: "center"}}> Learn more about the music you listen to and get recommendations to expand your musical options. </p> 
        <p style={{color: "white", textAlign: "center"}}>Login to Spotify.Smarter to see all of your playlists and to find out fun statistics about your songs</p>
        </div>
        <div className="centerTheseButtonsPlease">
        <div className="mb-2 centerVal">
          <Button style={{borderRadius: '15px', width: '200px', margin: '0 auto', position: 'absolute'}} size="lg" href="http://localhost:8081/login">
            Login
          </Button>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div className="mb-2 centerVal2">
          <Button style={{borderRadius: '15px', width: '200px', margin: '0 auto'}} size="lg" href="http://localhost:8081/totalRestart">
            Nuke
          </Button>
        </div>
        </div>
      </div>
    );
  }
}