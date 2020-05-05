import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useHistory} from 'react-router-dom'

export default class SongThumbnail extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      artistsNames: '',
      image: ''
    }
  }

  // routeChange=(id)=> {
  //   console.log('loading playlist id ' + id)
  //   let path = '/playlist/' + id;
  //   window.location.href= path
  // }

  componentDidMount() {
    console.log('songobj')
    console.log(this.props.songObj)
    var img = ''
    var artists = ''
    for (var ind in this.props.songObj.artists) {
      artists += this.props.songObj.artists[ind].name + ', '
    }
    if (!this.props.songObj.album.images[0]) {
      img = 'https://tidal.com/browse/assets/images/defaultImages/defaultPlaylistImage.png'
    } else {
      img = this.props.songObj.album.images[0].url
    }
    artists = artists.substring(0, artists.lastIndexOf(','))
    this.setState({
      artistsNames: artists,
      image: img
      // audio: aud
    })
  }

	render() {
		return (
      <div className="row" id={this.props.songObj.id} style={{maxHeight: "175px", marginTop: "5px"}}>
        <div className="col">
          <div>
            <img className="" src={} style={{maxHeight: "175px"}}/>
          </div>
        </div>
        <div className="col-9" style={{display: "flex", alignItems: "center"}}>
          <div>
            <h2>{this.props.songObj.name}</h2>
            <div>
              <h4>{this.state.artistsNames}</h4>
              <p>{this.props.songObj.album.name}</p>
            </div>
          </div>
        </div>
      </div>
		);
	}
}
