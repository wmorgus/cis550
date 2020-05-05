import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Dropdown, Table} from 'react-bootstrap';
import PageNavbar from './PageNavbar';
import CustomDropdown from './CustomDropdown';
// import { MDBForm, MDBSelectInput, MDBSelect, MDBSelectOptions, MDBSelectOption } from "mdbreact";

export default class LongestStreak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: [],
      sids: [],
      streaks: [],
      currSongs: [],
      table: [],
      sidc: [],
      table: [],
      dropdownjerns: []

    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
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

      dropdownjerns = result.map((songObj, i) =>{
        return(<Dropdown.Item onSelect={() => {
          this.handleSubmit(songObj[0]);
          var songItem = [songObj[1], songObj[2]];
          this.setState({
            song: songItem,
          });
          console.log(songObj[0])
          }}>{songObj[1] + ' by ' + songObj[2]}</Dropdown.Item>)
      });
      this.setState({
        dropdownjerns: dropdownjerns,
        sids: sidDivs,
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

  handleClear() {
    this.setState({
      streaks: []
    })
  }


  handleDropSubmit = (id) => {
    console.log('drop submitted: ' + id)
  }

  handleSubmit = (result) => {
    console.log(result);
		fetch("http://localhost:8081/longeststreak/" + result, {
		  method: 'GET' // The type of HTTP request.
		}).then(response => response.json()).then((data) => {
      console.log("rows vals: " + data.rows)
      var result = data.rows[0];
      console.log("result: " + result);
      result[1] = result[1].split("T")[0];
      result[2] = result[2].split("T")[0];
      var row = (
      <tr> 
        <td>{this.state.song[0]}</td>
        <td>{this.state.song[1]}</td>
        <td>{result[0]}</td>
        <td>{result[1]}</td>
        <td>{result[2]}</td>
      </tr>
      )
      var currSong = this.state.song[0] + this.state.song[1]
      var newStreaks = this.state.streaks
      var displaySongs = this.state.currSongs
      var checkInd = displaySongs.indexOf(currSong)
      if (checkInd != -1){
        displaySongs.splice(checkInd, 1)
        newStreaks.splice(checkInd, 1)
      }
      newStreaks.unshift(row)
      displaySongs.unshift(currSong)
      this.setState({
        streaks: newStreaks,
        currSongs: displaySongs
      });
    });
  }

  render() {
    return (
      <div>
        <PageNavbar active="time" apikey={this.props.apikey}/>
        <form>
            <Button variant="btn btn-success" href="http://localhost:3000/time" style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Back</Button>
        </form>
        <div style={{margin: "10px 10px"}}>
          <div className="h5">Longest Song Streaks</div>
          <p>How Many Consecutive Days a Song Has Stayed on the Charts</p>
          <div style={{display: "flex"}}>
            <div style={{maxHeight: '30%', marginRight: '10px', backgroundColor: '#08a1b3', borderColor: '#08a1b3'}}>
              <CustomDropdown dropdownjerns={this.state.dropdownjerns} style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}/>
            </div>
            <Button variant="danger" onClick={this.handleClear} style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Clear Table</Button>
          </div>
        </div>
        <div className="jumbotron">
        <div className="table">
                  <Table bordered striped hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Artists</th>
                        <th>Days</th>
                        <th>Start</th>
                        <th>End</th>
                      </tr>
                  </thead>
                  <tbody>
                    {this.state.streaks}
                  </tbody>
              </Table>
              </div>
          </div>
      </div>

    );
  }
}