import React from 'react';
import PageNavbar from './PageNavbar';
import PosterPoster from './PosterPoster';
import '../style/Poster.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Posters extends React.Component {
	constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      genres: [],
      movies: []
    }
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/posters",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(posterList => {
			if (!posterList) return;
			console.log(posterList)
      // Map each genreObj in genreList to an HTML element:
			// A button which triggers the showMovies function for each genre.
			var posterDivs = [];
			for (var i in posterList) {
				var posterObj = posterList[i];
				if (posterObj.Response == "True") {
      		posterDivs.push(<PosterPoster image={posterObj.Poster} link={"http://www.imdb.com/title/" + posterObj.imdbID} title={posterObj.Title} rating={posterObj.imdbRating} />)
				}
			}
      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        posters: posterDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
	}

  render() {   
		var wrapperStyle = {
			display: 'grid',
			gridColumnGap: '20px',
			gridTemplateColumns: 'auto auto auto'
		} 
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <br></br>
        <div className="container">
          <div className="jumbotron">
						<div className="h5">Posters</div>
            <div className="movies-container">
              <div id="results" style={wrapperStyle}>
                {this.state.posters}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}