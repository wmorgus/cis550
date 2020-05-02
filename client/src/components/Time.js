import React from 'react';
import '../style/Time.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import TopSongRow from './TopSongRow';

export default class Time extends React.Component {
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
      console.log("WE OUT HERE");
      alert("Date: " + this.state.month + "/" + this.state.day + "/" + this.state.year);
      event.preventDefault();

		fetch("http://localhost:8081/topsongsfrom/" + this.state.month + "_" + this.state.day + "_" + this.state.year,
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