import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table } from 'react-bootstrap';
import PageNavbar from './PageNavbar';
import PlayThumbPlus from './PlayThumbPlus';

export default class PlaylistComparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oid: '',
      columnName: "",
      thumbs: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    document.body.style = 'background: #bdeaef;';
    var oid = '';
    fetch('http://localhost:8081/spotify/getUser?apikey=' + this.props.apikey).then(response => response.json()).then((data) => {
      console.log(data)
      oid = 'million_playlist'
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
    this.setState({thumbs: []})

    fetch("http://localhost:8081/playlistacoustics/" + this.state.oid,
      {
        method: 'GET' // The type of HTTP request.
      }).then(response => response.json()).then((data) => {
        console.log(data.rows)
        var result = data.rows;
        console.log("result");
        console.log(result)
        var nails = result.map((songObj, i) =>
          <PlayThumbPlus id={songObj[0]} score={songObj[1]} apikey={this.props.apikey}/>
        )
        this.setState({
          columnName: "Your playlists, ordered by acousticness",
          thumbs: nails
        });
      });
  }

  handleDanceSubmit = (event) => {
    event.preventDefault();
    this.setState({thumbs: []})

    fetch("http://localhost:8081/playlistdance/" + this.state.oid,
      {
        method: 'GET' // The type of HTTP request.
      }).then(response => response.json()).then((data) => {
        console.log(data.rows)
        var result = data.rows;
        console.log(result[0]);
        var nails = result.map((songObj, i) =>
          <PlayThumbPlus id={songObj[0]} score={songObj[1]} apikey={this.props.apikey}/>
        )
        this.setState({
          columnName: "Your playlists, ordered by danceability",
          thumbs: nails
        });
      });
  }

  handleEnergySubmit = (event) => {
    event.preventDefault();
    this.setState({thumbs: []})

    fetch("http://localhost:8081/playlistenergy/" + this.state.oid,
      {
        method: 'GET' // The type of HTTP request.
      }).then(response => response.json()).then((data) => {
        console.log(data.rows)
        var result = data.rows;
        console.log(result[0]);
        var nails = result.map((songObj, i) =>
          <PlayThumbPlus id={songObj[0]} score={songObj[1]} apikey={this.props.apikey}/>
        )
        this.setState({
          columnName: "Your playlists, ordered by energy",
          thumbs: nails
        });
      });
  }

  render() {
    document.body.style = 'background: linear-gradient(120deg,#EC8BDA,#22C3DD);'
    return (
      <div
      style={{
        background: 'linear-gradient(120deg,#EC8BDA,#22C3DD)',
      }}>
      <div>
        <PageNavbar active="comparePlaylists" apikey={this.props.apikey} />
        <div className="container songtable-container">
          <div className="Home">
            <div className="lander" style={{marginTop: '10px', marginBottom: '20px'}}>
              <h1>Compare Your Playlists</h1>
              <p>Choose from the options below to rank your playlists</p>
            </div>
            <div className="container" style={{backgroundColor: 'rgba(200,200,200,0.95)', paddingTop: '10px', paddingBottom: '10px'}}>
              <div className="row" style={{display: "flex", justifyContent: "space-around"}}>   
                <Button variant="btn btn-success" onClick={this.handleAcousticSubmit} style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Acousticness</Button>
                <Button variant="btn btn-success" onClick={this.handleDanceSubmit} style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Danceability</Button>
                <Button variant="btn btn-success" onClick={this.handleEnergySubmit} style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Energy</Button>
              </div>
            </div>
          </div>
          <br></br>
          <div className="container">
            <div className="thumbs">
              <div className="thumbshead">
                <h5>{this.state.columnName}</h5>  
                {this.state.thumbs}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}