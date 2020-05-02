import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Dropdown} from 'react-bootstrap';
import PageNavbar from './PageNavbar';
import TopSidRow from './TopSidRow';
import TopSongRow from './TopSongRow';
// import { MDBForm, MDBSelectInput, MDBSelect, MDBSelectOptions, MDBSelectOption } from "mdbreact";

export default class LongestStreak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: "",
      sids: [],
      streak: [],
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
      let sidDivs = result.map((songObj, i) =>{
        if (i == 1) {
          console.log(songObj)
        }
        return(<option value={songObj[0]}>{songObj[1]}</option>)
      });
      console.log('siddivs\n\n\nsiddivs')
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

		fetch("http://localhost:8081/longeststreak/" + this.state.sid, {
		  method: 'GET' // The type of HTTP request.
		}).then(response => response.json()).then((data) => {
      console.log(data.rows)
      var result = data.rows;
      console.log(result[0]);
      this.setState({
        streak: result[0]
      });
    });
  }

  render() {
    return (
      <div className="container songtable-container">
        <PageNavbar active="time" apikey={this.props.apikey}/>
        <form>
          <Button variant="btn btn-success" href="http://localhost:3000/time">Back</Button>
        </form>
        <div className="Jumbotron">
          <div className="lander">
          <div className="h5">Longest Song Streaks</div>
            <p>How Many Consecutive Days a Song Has Stayed on the Charts</p>
          </div>
        </div>
        <form onSubmit = {this.handleSubmit} className="inputForm">
            <select>
              {this.state.sids}
            </select>
        </form>
        
        <div className="jumbotron">
        <div className="movies-container">
			          <div className="movie">
                  <div className="header"><strong>Days</strong></div>
                  <div className="header"><strong>Start</strong></div>
                  <div className="header"><strong>End</strong></div>
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