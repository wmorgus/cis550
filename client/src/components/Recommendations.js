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


         
        fetch('http://localhost:8081/spotify/getPlaylists?apikey=' + this.props.apikey).then(response => response.json()).then((data) => {
          console.log(data);
          data.items.forEach(item => {
            console.log(item.owner.id);
          });
          //console.log(data.href);
          
          //find the user currently logged in 
          var split = data.href.split('/');
          var parsedUser; 
          for(var i = 0; i < split.length; i++) {
            if(split[i] == 'users') {
              parsedUser = split[i + 1];
            }
          }
          console.log('parsed user: ' + parsedUser);
          /*
          split.forEach(seg => {
            console.log(seg);
          });
          */

          //loop through all playlists and display those belonging to current user
          var myPlaylists = [];
          data.items.forEach(item => {
           // console.log(item.owner.id + ' vs ' + parsedUser + ': result? ' + item.owner.id === parsedUser);
            if(item.owner.id == parsedUser){
              console.log(item.id + 'belongs to ' + item.owner.id);
              myPlaylists.push(item.id); 
            }
          });
          

          myPlaylists.forEach(seg => {
            console.log(seg);
          });

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