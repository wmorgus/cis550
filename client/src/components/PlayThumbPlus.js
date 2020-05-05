import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';

export default class PlayThumbPlus extends React.Component {
	constructor(props) {
    // console.log(props)
		super(props);
  }

  componentDidMount() {
    fetch('http://localhost:8081/spotify/getJustPlaylist?apikey=' + this.props.apikey + '&id=' + this.props.id).then(response => response.json()).then((data) => {
      // console.log('dataobj')
      // console.log(data)
      newObj = data
      songThumbs = data.allSongs.map((songObj, i) =>
        <SongThumbnail songObj={songObj}/>
      )
    }).finally(() => {
      this.setState({
        playlistObj: newObj,
        songThumbnails: songThumbs,
        id: id
    })})
  }

	render() {
		var wrapper = {
      margin: "3px 0px", 
      padding: "7px 0px", 
      backgroundColor: "#f3f3f3"
		}
		
		return (
      <div className="row" id={this.props.id} style={wrapper}>
        <div className="col">
          <div>
            <img className="" src={this.state.image} style={{height: "175px", width: "175px", objectFit: "cover", overflow: "none"}}/>
          </div>
        </div>
        <div className="col-8" style={{display: "flex", alignItems: "center"}}>
          <div>
            <h2>{this.state.name}</h2>
            <h3>{this.props.score}</h3>
          </div>
        </div>
        <div className="col" style={{}}>
          <Button href={"/playlist/" + this.props.id}>View Playlist</Button>
        </div>
      </div>
		);
	}
}
