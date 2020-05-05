import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';

export default class PlaylistThumbnail extends React.Component {
	constructor(props) {
    // console.log(props)
		super(props);
  }

  // routeChange=(id)=> {
  //   console.log('loading playlist id ' + id)
  //   let path = '/playlist/' + id;
  //   window.location.href= path
  // }

	render() {
		var cursedButton = {
      margin: "3px 0px", 
      padding: "7px 0px", 
      backgroundColor: "#f3f3f3"
		}
		
		return (
      <div className="row" id={this.props.id} style={cursedButton} onClick={() => {
          window.location.href = '/playlist/' + this.props.id
        }}>
        <div className="col">
          <div>
            <img className="" src={this.props.image} style={{height: "175px", width: "175px", objectFit: "cover", overflow: "none"}}/>
          </div>
        </div>
        <div className="col-7" style={{display: "flex", alignItems: "center"}}>
          <div>
            <h2>{this.props.name}</h2>
            <h4>{this.props.owner}</h4>
          </div>
        </div>
        <div className="col align-middle" style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around"}}>
            <Button href={"/playlist/" + this.props.id} style={{height: "25%", width: "100%"}}>Go to Playlist</Button>
            <Button href={"/recommendations/" + this.props.id} style={{height: "25%", width: "100%"}}>Get Recs</Button>
        </div>
      </div>
		);
	}
}
