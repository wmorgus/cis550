import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import {Button} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import RecPlaylistThumbnail from './RecPlaylistThumbnail';
import {useHistory} from 'react-router-dom';

export default class GenreButton extends React.Component {
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
      backgroundColor: "#f3f3f3", 
      cursor: "pointer"
		}
		
		return (
     <div className="row" id={this.props.id} /*style={cursedButton} onClick={() => {
          window.location.href = '/playlist/' + this.props.id
        }}*/>
        <div className="col">
          <div>
            <img className="" src={this.props.image} style={{maxHeight: "175px"}}/>
          </div>
        </div>
        <div className="col-9" style={{display: "flex", alignItems: "center"}}>
          <div>
            <h2>{this.props.name}</h2>
            <h4>{this.props.owner}</h4>
            <Button variant="info" href= {this.props.generate}  >Generate Recommendations</Button>
          </div>
          
        </div>
       
      </div>
		);
	}
}
