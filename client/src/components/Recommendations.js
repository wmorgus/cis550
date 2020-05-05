import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import RecPlaylistThumbnail from './RecPlaylistThumbnail.js';

export default class Recommendations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          yourPlaylists: [],
          followPlaylists: []
        }

      }

      componentDidMount() {
            
        var ownedPlaylists = [];
        var followedPlaylists = [];
        fetch('http://localhost:8081/spotify/getPlaylists?apikey=' + this.props.apikey).then(response => response.json()).then((data) => {
          console.log(data);

          //find the user currently logged in 
          var split = data.href.split('/');
          var parsedUser; 
          for(var i = 0; i < split.length; i++) {
            if(split[i] === 'users') {
              parsedUser = split[i + 1];
            }
          }

          //loop through all playlists and display those belonging to current user
          for (var ind in data.items) {
            var curr = data.items[ind];
            var redirectTo = "http://localhost:3000/recommendations/" + curr.id;
            //console.log(curr)
            //console.log(curr.images)
            if(curr.owner.id === parsedUser){
             
              ownedPlaylists.push(<RecPlaylistThumbnail id={curr.id} name={curr.name} image={curr.images[0].url} owner={curr.owner.display_name} generate = {redirectTo} />);
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

      render() {   
        
        return (
          <div className="Recommendations"style={{
            background: 'linear-gradient(120deg,#EC8BDA,#22C3DD)',
          }}>
    
            <PageNavbar active="yourPlaylists" apikey={this.props.apikey}/>
    
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