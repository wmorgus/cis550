import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class GenreButton extends React.Component {
	constructor(props) {
		super(props);
  }
  
  loadPlaylist() {
    // this.props.id
    console.log('new page plz')
  }

	render() {
		var cursedButton = {
      margin: "3px 0px", 
      padding: "7px 0px", 
      backgroundColor: "#f3f3f3", 
      cursor: "pointer"
		}
		
		return (
      <div className="row" id={this.props.id} style={cursedButton} >
        <div className="col">
          <div>
            <img className="" src={this.props.image} style={{maxHeight: "175px"}}/>
          </div>
        </div>
        <div className="col-9" style={{display: "flex", alignItems: "center"}}>
          <div>
            <h2>{this.props.name}</h2>
            <h4>{this.props.owner}</h4>
          </div>
        </div>
      </div>
		);
	}
}
