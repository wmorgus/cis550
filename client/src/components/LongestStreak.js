import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import {Dropdown} from 'react-bootstrap';
import PageNavbar from './PageNavbar';
import TopSidRow from './TopSidRow';
import TopSongRow from './TopSongRow';
import { MDBForm, MDBSelectInput, MDBSelect, MDBSelectOptions, MDBSelectOption } from "mdbreact";

export default class LongestStreak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: "",
      songs: [],
      sids: [],
      sidc: [],
      table: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/streaksids",
    {
        method: 'GET' // The type of HTTP request.
    }).then(response => response.json()).then((data) => {
  console.log(data.rows)
  var result = data.rows;
  console.log(result[0]);
  let sidDivs = result.map((songObj, i) =>
    <option value={songObj.title}>{songObj.title}</option>
          );
          this.setState({
        sids: sidDivs
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

    handleSubmit = (event) => {
      event.preventDefault();

		fetch("http://localhost:8081/longeststreak/",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(response => response.json()).then((data) => {
      console.log(data.rows)
      var result = data.rows;
      console.log(result[0]);
      let songDivs = result.map((songObj, i) =>
			<TopSongRow key={i} title={songObj[0]} artists={songObj[1]} streams={songObj[2]}/>
			  );
			  this.setState({
        songs: songDivs
			  });

      });
    }

  render() {
    return (
      <div className="container songtable-container">
        <PageNavbar active="time" apikey={this.props.apikey}/>
        <div className="Jumbotron">
          <div className="lander">
          <div className="h5">Longest Song Streaks</div>
            <p>How Many Consecutive Days a Song Has Stayed on the Charts</p>
                
          </div>
        </div>
        <form onSubmit = {this.handleSubmit} className="inputForm">
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Dropdown Button
            </Dropdown.Toggle>

            <Dropdown.Menu value={this.state.song} onChange={this.handleInputChange} >
                    {this.state.sidc}
            </Dropdown.Menu>
            </Dropdown>
        </form>
        
        <div className="jumbotron">
        <div className="movies-container">
			          <div className="movie">
                  <div className="header"><strong>title</strong></div>
                  <div className="header"><strong>artists</strong></div>
                  <div className="header"><strong>streams</strong></div>
              </div>
              <div className="movies-container" id="results">
              {this.state.songs}
              </div>
            </div>
            </div>
      </div>

    );
  }
}