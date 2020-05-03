import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Dropdown, Table} from 'react-bootstrap';
import PageNavbar from './PageNavbar';
import TopSidRow from './TopSidRow';
import TopSongRow from './TopSongRow';
import CustomDropdown from './CustomDropdown';
// import { MDBForm, MDBSelectInput, MDBSelect, MDBSelectOptions, MDBSelectOption } from "mdbreact";

export default class LongestStreak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: [],
      sids: [],
      streak: [],
      table: [],
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
      this.setState({
        streak: result
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
                    <tr>
                      <td>{this.state.song[0]}</td>
                      <td>{this.state.song[1]}</td>
                      <td>{this.state.streak[0]}</td>
                      <td>{this.state.streak[1]}</td>
                      <td>{this.state.streak[2]}</td>
                    </tr>
                  </tbody>
              </Table>
              </div>
          </div>
      </div>

    );
  }
}