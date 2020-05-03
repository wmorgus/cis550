import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useHistory} from 'react-router-dom'

export default class SongThumbnail extends React.Component {
	constructor(props) {
		super(props);
  }

  // routeChange=(id)=> {
  //   console.log('loading playlist id ' + id)
  //   let path = '/playlist/' + id;
  //   window.location.href= path
  // }

  componentDidMount() {

  }

	render() {
		
		return (
      <div className="row" id={this.props.songObj.id} style={{maxHeight: "175px", marginTop: "5px"}}>
        <div className="col">
          <div>
            <img className="" src={this.props.songObj.album.images[0].url} style={{maxHeight: "175px"}}/>
          </div>
        </div>
        <div className="col-9" style={{display: "flex", alignItems: "center"}}>
          <div>
            <h2>{this.props.songObj.name}</h2>
            <h4>{this.props.songObj.album.name}</h4>
          </div>
        </div>
      </div>
		);
	}
}
