import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Table} from 'react-bootstrap';
import PageNavbar from './PageNavbar';

export default class TopSongs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: 1,
      month: 1,
      year: 2017,
      table: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
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

		fetch("http://localhost:8081/topsongsfrom/" + this.state.month + "_" + this.state.day + "_" + this.state.year,
		{
		  method: 'GET' // The type of HTTP request.
		}).then(response => response.json()).then((data) => {
      console.log(data.rows)
      var result = data.rows;
      console.log(result[0]);
      let songDivs = result.map((songObj, i) =>
      <tr key = {i}>
        <td>{songObj[0]}</td>
        <td>{songObj[1]}</td>
        <td>{songObj[2]}</td>
      </tr>
			  );
			  this.setState({
        songs: songDivs
			  });

      });
    }

  render() {
    document.body.style = 'background: #bdeaef;';
    return (
      <div className="topSongs">
        <PageNavbar active="time" apikey={this.props.apikey}/>
        <br></br>
          <div className="container bestgenres-container" >
            <div className="jumbotron" style = {{backgroundColor: 'rgba(250, 250, 250, .4)'}}>
            <h1>Top of the Charts</h1>
            <p>Find the top 100 songs on any day from 2017-2018</p>
            <form>
              <Button variant="btn btn-success" href="http://localhost:3000/time" style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Back</Button>
            </form>
        <br></br>
        <form onSubmit = {this.handleSubmit} className="inputForm">
          <br />
          <label>
            Day:
            <input
              name="day"
              type="number"
              value={this.state.day}
              onChange={this.handleInputChange} />
          </label>
          <br />
          <label>
            Month:
            <input
              name="month"
              type="number"
              value={this.state.month}
              onChange={this.handleInputChange} />
          </label>
          <br />
          <label>
            Year:
            <input
              name="year"
              type="number"
              value={this.state.year}
              onChange={this.handleInputChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <br></br>
        </div>
        </div>
        <div className="jumbotron" style = {{backgroundColor: 'rgba(250, 250, 250, .4)'}}>
            <div className="movies-container">
			          <div className="table">
                  <Table bordered striped hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Artists</th>
                        <th>Streams</th>
                      </tr>
                  </thead>
                  <tbody>
                    {this.state.songs}
                  </tbody>
              </Table>
              </div>
            </div>
            </div>
      </div>

    );
  }
}