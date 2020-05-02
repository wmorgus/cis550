import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import PageNavbar from './PageNavbar';
import TopArtistRow from './TopArtistRow';


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
			<TopArtistRow key={i} artist={artistObj[0]} streams={artistObj[1]} percent={Math.round(10000*artistObj[2])/100 + "%"}/>
			  );
			  this.setState({
        artists: artistDivs
			  });

      });
    }

  render() {
    return (
    <div className="BestGenres">
        <PageNavbar active="bestgenres" />

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
                <div className="movie">
                <div className="header"><strong>artist</strong></div>
                <div className="header"><strong>streams</strong></div>
                <div className="header"><strong>percent of streams</strong></div>
                </div>
                <div className="movies-container" id="results">
                {this.state.artists}
                </div>
            </div>
            </div>
        </div>
    </div>
    );
  }
}