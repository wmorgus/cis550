import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Dropdown} from 'react-bootstrap';
import PageNavbar from './PageNavbar';
import TopSidRow from './TopSidRow';
import TopSongRow from './TopSongRow';
import CustomDropdown from './CustomDropdown';
// import { MDBForm, MDBSelectInput, MDBSelect, MDBSelectOptions, MDBSelectOption } from "mdbreact";

export default class LongestStreak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: "",
      songs: [],
      sids: [],
      sidc: [],
      table: [],
      dropdownjerns: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    // Send an HTTP request to the server.
    var songObjs = []
    fetch("http://localhost:8081/streaksids",
    {
      method: 'GET' // The type of HTTP request.
    }).then(response => response.json()).then((data) => {
      console.log(data.rows)
      var result = data.rows;
      console.log(result[0]);
      var dropdownjerns = []
      var sidDivs = []
      // let sidDivs = result.map((songObj, i) =>{
      //   if (i == 1) {
      //     console.log(songObj)
      //   }
      //   songObjs.push({name: songObj[1] + ' by ' + songObj[2], id: songObj[0]})
      //   return(<option value={songObj[0]}>{songObj[1]}</option>)
      // });
      dropdownjerns = result.map((songObj, i) =>{
        return(<Dropdown.Item onSelect={() => {
          //handlesubmithere
          console.log(songObj[0])
          }}>{songObj[1] + ' by ' + songObj[2]}</Dropdown.Item>)
      });
      this.setState({
        dropdownjerns: dropdownjerns,
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

  handleDropSubmit = (id) => {
    console.log('drop submitted: ' + id)
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(event)
		fetch("http://localhost:8081/longeststreak/", {
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
      <div>
        <PageNavbar active="time" apikey={this.props.apikey}/>
        <div style={{display: ""}}>
          <div className="h5">Longest Song Streaks</div>
          <p>How Many Consecutive Days a Song Has Stayed on the Charts</p>
          <div style={{maxHeight: '30%'}}>
            <CustomDropdown dropdownjerns={this.state.dropdownjerns}/>
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
                {this.state.songs}
              </div>
            </div>
          </div>
      </div>

    );
  }
}