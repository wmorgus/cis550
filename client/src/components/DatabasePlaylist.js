import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SongThumbnail from './SongThumbnail';
import PageNavbar from './PageNavbar';

export default class DatabasePlaylist extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        pid: '',
      }
    }

    componentDidMount() {
      //the react gods hate me right now.
      var id = window.location.href.split('/')[window.location.href.split('/').length - 1]
     
        this.setState({
         pid: id
        });
 
    }

   

    render() {    
      return (
        <div className="playlist">
          <PageNavbar active="recommendations" apikey={this.props.apikey} />
          <h2>Track List for Playlist {this.state.pid}</h2> 
        </div>
    )};
}