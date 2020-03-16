import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class GenreButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var posterStyle = {
			display: 'inline-flex',
			alignContent: 'center',
			justifyContent: 'space-between',
			height: '100%',
			flexDirection: 'column'
		}
		var imgStyle = {
			width: '100%',

		}
		let subheadStyle = {
			display: 'flex',
			justifyContent: 'space-between',
			paddingTop: '10px',
			backgroundColor: 'rgb(232,232,232, 0.4)',
			paddingBottom: '10px'
		}
		return (
			<div className="poster" style={posterStyle}>
				<img className="img-thumbnail" src={this.props.image} style={imgStyle} alt={this.props.title}/>
				<div style={subheadStyle}>
					<a className="title" href={this.props.link} target="_blank">{this.props.title}</a>
					<p>☆{this.props.rating}</p>
				</div>
			</div>
		);
	}
}
