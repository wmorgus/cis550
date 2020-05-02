import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class Recommendations extends React.Component {
    constructor(props) {
        super(props);
      }

      componentDidMount() {
            // Send an HTTP request to the server.
        fetch("http://localhost:8081/recommendations",
        {
          method: 'GET' // The type of HTTP request.
        }).then(res => {
          // Convert the response data to a JSON.
          return res.json();
        }, err => {
          // Print the error if there is one.
          console.log(err);
        }).then(genreList => {
          if (!genreList) return;
          // Map each genreObj in genreList to an HTML element:
          // A button which triggers the showMovies function for each genre.
          /*
          let genreDivs = genreList.map((genreObj, i) =>
          <GenreButton id={"button-" + genreObj.genre} onClick={() => this.showMovies(genreObj.genre)} genre={genreObj.genre} />
          );

          // Set the state of the genres list to the value returned by the HTTP response from the server.
          this.setState({
            genres: genreDivs
          });
          */
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });

      }

      render() { 
        console.log('test');   
        return (
          <div className="Recommendations">
    
            <PageNavbar active="recommendations" apikey={this.props.apikey}/>
    
            <br></br>

            <p> helo </p>

            {/* <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">Recommendations</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Movie Name" value={this.state.movieName} onChange={this.handleMovieNameChange} id="movieName" className="movie-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitMovie}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    			<div className="h6">You may like ...</div>
			    			<div className="headers">
			    				<div className="header"><strong>Title</strong></div>
			    				<div className="header"><strong>Movie ID</strong></div>
					            <div className="header"><strong>Rating</strong></div>
					            <div className="header"><strong>Vote Count</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recMovies}
			    		</div>
			    	</div>
			    </div> */}

        </div>

        )};
}