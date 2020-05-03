import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import PageNavbar from './PageNavbar';
import TopSongRow from './TopSongRow';

export default class PlaylistComparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oid: 'million_playlist',
      playlists:[]
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    var oid = '';
    fetch('http://localhost:8081/spotify/getUser?apikey=' + this.props.apikey).then(response => response.json()).then((data) => {
			console.log(data)
			oid = data.id
		}).finally(() => {
			this.setState({
				oid: oid
			});
		});

  }

  handleInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  handleAcousticSubmit = (event) => {
    event.preventDefault();

  fetch("http://localhost:8081/playlistacoustics/" + this.state.oid,
  {
    method: 'GET' // The type of HTTP request.
  }).then(response => response.json()).then((data) => {
    console.log(data.rows)
    var result = data.rows;
    console.log(result[0]);
    this.setState({
      playlists: result
      });
    });
  }

  handleDanceSubmit = (event) => {
    event.preventDefault();
      fetch("http://localhost:8081/playlistdance/" + this.state.oid,
      {
        method: 'GET' // The type of HTTP request.
      }).then(response => response.json()).then((data) => {
    console.log(data.rows)
    var result = data.rows;
    console.log(result[0]);
    this.setState({
      playlists: result
            });
    });
  }

  handleEnergySubmit = (event) => {
    event.preventDefault();

      fetch("http://localhost:8081/playlistenergy/" + this.state.oid,
      {
        method: 'GET' // The type of HTTP request.
      }).then(response => response.json()).then((data) => {
    console.log(data.rows)
    var result = data.rows;
    console.log(result[0]);
    this.setState({
      playlists: result
            });
    });
  }

  render() {
    return (
      <div className="container songtable-container">
        <PageNavbar active="time" apikey={this.props.apikey}/>
        <div className="Home">
          <div className="lander">
            <h1>Compare Your Playlists</h1>
            <p>Choose from the options below to rank your playlists</p>
            <form>
              <Button variant="btn btn-success" href="http://localhost:3000">Back</Button>
            </form>
            <form>
              <Button variant="btn btn-success" onClick = {this.handleAcousticSubmit}>Acousticness</Button>
            </form>
            <form>
              <Button variant="btn btn-success" onClick = {this.handleDanceSubmit}>Danceability</Button>
            </form>
            <form>
              <Button variant="btn btn-success" onClick = {this.handleEnergySubmit}>Energy</Button>
            </form>
          </div>
        </div>
        
        <div className="jumbotron">
        <div className="movies-container">
			          <div className="movie">
                  <div className="header"><strong>title</strong></div>
                  <div className="header"><strong>artists</strong></div>
                  <div className="header"><strong>streams</strong></div>
              </div>
              <div className="movies-container" id="results">
              {this.state.playlists}
              </div>
            </div>
            </div>
      </div>

    );
  }
}