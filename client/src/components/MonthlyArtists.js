import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Table} from 'react-bootstrap';
import PageNavbar from './PageNavbar';


export default class MonthlyArtists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: 1,
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      year: 2017,
      years: [2017, 2018],
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
      console.log("WE OUT HEREeEeE");
      event.preventDefault();

		fetch("http://localhost:8081/monthlyartists/" + this.state.month + "_" + this.state.year,
		{
		  method: 'GET' // The type of HTTP request.
		}).then(response => response.json()).then((data) => {
      console.log(data.rows)
      var result = data.rows;
      console.log(result[0]);
      let artistDivs = result.map((artistObj, i) =>
      <tr key = {i}>
      <td>{artistObj[0]}</td>
      <td>{artistObj[1]}</td>
      <td>{Math.round(artistObj[2] * 10000) / 100 + "%"}</td>
    </tr>
			  );
			  this.setState({
        artists: artistDivs
			  });

      });
    }

  render() {
    document.body.style = 'background: #bdeaef;';
    return (
    <div className="BestGenres">
        <PageNavbar active="bestgenres" />
        <form>
            <Button variant="btn btn-success" href="http://localhost:3000/time" style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Back</Button>
        </form>
        <div className="container bestgenres-container">
            <div className="jumbotron">
            <div className="h5">Top Monthly Artists</div>
            <p>Top 10 Artists of Each Month, 2017 - 2018</p>
            <form onSubmit = {this.handleSubmit} className="inputForm">
             <br />
                    <label>
                    Year:
                    <input
                    name="year"
                    type="number"
                    value={this.state.year}
                    onChange={this.handleInputChange} />
                </label>
                    
                <label>
                Month:
                    <input
                    name="month"
                    type="number"
                    value={this.state.month}
                    onChange={this.handleInputChange} />
                </label>
            <input type="submit" value="Submit" />
            </form>
          </div>

            <div className="jumbotron">
            <div className="movies-container">
			          <div className="table">
                  <Table bordered striped hover>
                    <thead>
                      <tr>
                        <th>Artist</th>
                        <th>Streams</th>
                        <th>Percent of Streams</th>
                      </tr>
                  </thead>
                  <tbody>
                    {this.state.artists}
                  </tbody>
              </Table>
              </div>
            </div>
            </div>
        </div>
    </div>
    );
  }
}