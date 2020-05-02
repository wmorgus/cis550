import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import PageNavbar from './PageNavbar';

export default class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <div className="container songtable-container">
        <PageNavbar active="time" apikey={this.props.apikey}/>
        <div className="Home">
          <div className="lander">
            <h1>Songs Throughout Time</h1>
            <p>Different analyses of top songs from 2017-2018</p>
            <form>
              <Button variant="btn btn-success" href="http://localhost:3000/monthlyartists">Monthly Top Artists</Button>
              <p></p>
              <Button variant="btn btn-success" href="http://localhost:3000/topsongs">Top Songs</Button>
              <p></p>
              <Button variant="btn btn-success" href="http://localhost:3000/longeststreak">Longest Streak</Button>
            </form>
          </div>
        </div>
      </div>

    );
  }
}