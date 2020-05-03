import React from 'react';
import { useParams } from "react-router";
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import PlaylistThumbnail from './PlaylistThumbnail';

export default class Playlist extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        songs: []
      }
    }

    componentDidMount() {
      //the react gods hate me right now.
      var id = window.location.href.split('/')[window.location.href.split('/').length - 1]
      console.log(this.props.apikey)
      var playlists = []
      console.log(id)
      // fetch('http://localhost:8081/spotify/getPlaylist?apikey=' + this.props.apikey + '&id=' + id).then(response => response.json()).then((data) => {
      //   console.log(data)
      //   for (var ind in data.items) {
      //     var curr = data.items[ind];
      //     console.log(curr)
      //     console.log(curr.images)
      //     playlists.push(<PlaylistThumbnail id={curr.id} name={curr.name} image={curr.images[0].url} owner={curr.owner.display_name} key={ind}/>)
      //   }
      // }).finally(() => {
      //   this.setState({
      //     playlists: playlists
      //   });
      // });
    }

    render() {    
      return (
        <div className="playlist">
          <PageNavbar active="yourPlaylists" apikey={this.props.apikey}/>
          <div className="container">
            <h1>will</h1>
            <h2>{this.props.apikey}</h2>
          </div>
        </div>
    )};
}