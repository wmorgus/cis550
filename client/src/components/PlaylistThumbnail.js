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
      all: 'inherit',
      cursor: 'pointer'
		}
		
    //playlists.add(<PlaylistThumbnail id={curr.id} name={curr.name} image={curr.images[0]} owner={curr.owner.displayname}/>)
		return (
			
      <button style={cursedButton}>
      <div className="row" id={this.props.id} style={{margin: "5px 0px", padding: "5px 0px", backgroundColor: "#f3f3f3"}} onClick={this.loadPlaylist} href={'/playlist/' + this.props.id}>
        <div className="col">
          <div>
            <img className="" src={this.props.image} style={{maxHeight: "200px"}}/>
          </div>
        </div>
        <div className="col-9" style={{display: "flex", alignItems: "center"}}>
          <div>
            <h2>{this.props.name}</h2>
            <h4>{this.props.owner}</h4>
          </div>
        </div>
      </div>
      </button>
			
		);
	}
}
