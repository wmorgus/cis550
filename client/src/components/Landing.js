import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Landing.css';
import {Button, ButtonGroup} from 'react-bootstrap';

export default class Landing extends React.Component {

  render() {
    return (
      <div className="landing">
        <p style={{color: "white", fontSize: "3em", textAlign: "center"}} center> Welcome to Spotify.<span style={{color: "#22c3dd"}}>Smarter</span> </p>

        <div className="mb-2 centerVal">
          <Button variant="primary" size="lg" href="http://localhost:8081/login">
            Login
          </Button>
        </div>
        <div className="mb-2">
          <Button variant="secondary" size="lg" href="http://localhost:8081/totalRestart">
            Nuke
          </Button>
        </div>
      </div>
    );
  }
}