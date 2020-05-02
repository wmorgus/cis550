import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import PlaylistThumbnail from './PlaylistThumbnail';

export default class YourPlaylists extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        playlists: []
      }
    }

    componentDidMount() {
      console.log(this.props.apikey)
      var playlists = []
      fetch('http://localhost:8081/spotify/getPlaylists?apikey=' + this.props.apikey).then(response => response.json()).then((data) => {
        console.log(data)
        for (var ind in data.items) {
          var curr = data.items[ind];
          console.log(curr)
          console.log(curr.images)
          playlists.push(<PlaylistThumbnail id={curr.id} name={curr.name} image={curr.images[0].url} owner={curr.owner.display_name} key={ind}/>)
        }
      }).finally(() => {
        this.setState({
          playlists: playlists
        });
      });
    }

    render() {    
      return (
        <div className="yourPlaylists">
  
          <PageNavbar active="yourPlaylists" apikey={this.props.apikey}/>
          <div className="container">
            {this.state.playlists}
          </div>
        </div>
    )};
}