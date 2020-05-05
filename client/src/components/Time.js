import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import PageNavbar from './PageNavbar';

export default class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (

      <div className="Time">
        <PageNavbar active="time" apikey={this.props.apikey}/>
        <div className="Home">
          <div className="lander container">
            <h1 style={{ textAlign: "center" }}>Songs Throughout Time</h1>
            <p style={{ textAlign: "center" }}>Different analyses of top songs from 2017-2018</p>
            <form>
              <div className="row">
                <div className="col-lg-6 artist-words">
                  Check out the top artists of every month in the years 2017 and 2018 on Spotify! You can see how many streams each artists
                  had as well as their percentage of overall streams in 2017 and 2018.
                <br></br>
                  <br></br>

                  <Button variant="btn btn-success" href="http://localhost:3000/monthlyartists" style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Monthly Top Artists</Button>
                </div>
                <div className="col-lg-6">
                  <div className="photo2"></div>
                </div>

              </div>

              <br></br>
              <br></br>
              <div className="row">
                <div className="col-lg-6">
                  <div className="photo3"></div>
                </div>
                <div className="col-lg-6 artist-words">
                  Look at the top songs between 2017 and 2018! Enter the day, month, and year that you would like to see information about
                  and the artists with the most streams will be displayed at the top. 
                  <br></br>
                  <br></br>

                  <Button variant="btn btn-success" href="http://localhost:3000/topsongs" style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Top Songs</Button>
                </div>
              </div>
              <br></br>
              <br></br>
              <div className="row">
                <div className="col-lg-6 artist-words">
                  Find out more about the longest consecutive day streak a song was considered 'Top 100' in 2017 and 2018! 
                  Just click on an arrow to find out when the streak started and ended and the total number of days. 
                 <br></br>
                  <br></br>

                  <Button variant="btn btn-success" href="http://localhost:3000/longeststreak" style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Longest Streak</Button>
                </div>
                <div className="col-lg-6">
                  <div className="photo"></div>
                </div>

              </div>
              <br></br>
              <br></br>
              <div className="row">
                <div className="col-lg-6">
                  <div className="photo4"></div>
                </div>
                <div className="col-lg-6 artist-words">
                  Click the button below to find out the average danceability, energy, and acousticness values of songs in a month between 2017 and 2018.
                <br></br>
                  <br></br>

                  <Button variant="btn btn-success" href="http://localhost:3000/graphs" style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Graphs</Button>
                </div>


              </div>
            </form>
          </div>
        </div>
      </div>

    );
  }
}