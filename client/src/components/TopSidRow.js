import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TopSongRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			// <div className="songResults">
			// 	<div className="title">{this.props.title}</div>
			// 	<div className="artists">{this.props.artist}</div>
            //     <div className="streams">{this.props.streams}</div>
			// </div>

            <div className="row" id={this.props.key} style={{ backgroundColor: "#f3f3f3"}} onClick={this.loadPlaylist}>
                <div className="col-9" style={{display: "flex", alignItems: "right"}}>
                    <div className="col"style={{display: "flex", alignItems: "center"}}>
                        <h6>{this.props.sid}</h6>
                    </div>
                    <div className="col"style={{display: "flex", alignItems: "center"}}>
                        <h6>{this.props.title}</h6>
                    </div>
                     <div className="col-sm-"style={{display: "flex", alignItems: "center"}}>
                        <h6>{this.props.artist}</h6>
                    </div>
                </div>
            </div>
		);
	}
}