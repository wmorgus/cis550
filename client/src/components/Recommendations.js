import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import RecPlaylistThumbnail from './RecPlaylistThumbnail';

export default class Recommendations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          yourPlaylists: [],
          followPlaylists: []
        }
      }

      componentDidMount() {
            // Send an HTTP request to the server.
        /*
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
          
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });
*/

        var ownedPlaylists = [];
        var followedPlaylists = [];
        fetch('http://localhost:8081/spotify/getPlaylists?apikey=' + this.props.apikey).then(response => response.json()).then((data) => {
          console.log(data);
         
          /*
          data.items.forEach(item => {
            console.log(item.owner.id);
          });
*/
          
          //find the user currently logged in 
          var split = data.href.split('/');
          var parsedUser; 
          for(var i = 0; i < split.length; i++) {
            if(split[i] == 'users') {
              parsedUser = split[i + 1];
            }
          }
         //console.log('parsed user: ' + parsedUser);

          //loop through all playlists and display those belonging to current user
          for (var ind in data.items) {
            var curr = data.items[ind];
            var redirectTo = "http://localhost:3000/recommendations/" + curr.id;
            console.log(curr)
            console.log(curr.images)
            if(curr.owner.id == parsedUser){
        
              ownedPlaylists.push(<RecPlaylistThumbnail id={curr.id} name={curr.name} image={curr.images[0].url} owner={curr.owner.display_name} generate = {redirectTo}/>);
            } else {
              followedPlaylists.push(<RecPlaylistThumbnail id={curr.id} name={curr.name} image={curr.images[0].url} owner={curr.owner.display_name} generate = {redirectTo}/>);
            }
            
          }
        }).finally(() => {
        this.setState({
          yourPlaylists: ownedPlaylists,
          followPlaylists: followedPlaylists
        });
      });
    };

    selectPlaylist() {
      //update state to show which playlist was selected
    }
    
      render() { 
        console.log('test');   
        return (
          <div className="Recommendations">
    
            <PageNavbar active="recommendations" apikey={this.props.apikey}/>
    
            <br></br>
            <h2>Your Playlists</h2>
            <div className="container">
            {this.state.yourPlaylists}
          </div>

          <h2>Playlists You Follow</h2>
            <div className="container">
            {this.state.followPlaylists}
          </div>

        </div>

        )};
}