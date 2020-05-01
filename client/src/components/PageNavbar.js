import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  NavDropdown } from 'react-bootstrap';

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		}
	}

	componentDidMount() {
		const pageList=['yourPlaylists', 'followPlaylists', 'recommendations', 'time']
		console.log(this.props.active)
		let navbarDivs = pageList.map((page, i) => {
			if (i === 0) {
				if (this.props.active === page) {
					return <a className="nav-item nav-link active" key={i} href="/">Your Playlists</a>
				} else {
					return <a className="nav-item nav-link" key={i} href="/">Your Playlists</a>
				}
			} else if (i === 1) {
				if (this.props.active === page) {
					return <a className="nav-item nav-link active" key={i} href="/followPlaylists">Playlists You Follow</a>
				} else {
					return <a className="nav-item nav-link" key={i} href="/followPlaylists">Playlists You Follow</a>
				}
			} else if (i === 2) {
				if (this.props.active === page) {
					return <a className="nav-item nav-link active" key={i} href="/recommendations">Recommendations</a>
				} else {
					return <a className="nav-item nav-link" key={i} href="/recommendations">Recommendations</a>
				}
			} else if (i === 3) {
				if (this.props.active === page) {
					return <a className="nav-item nav-link active" key={i} href="/time">Songs Throughout Time</a>
				} else {
					return <a className="nav-item nav-link" key={i} href="/time">Songs Throughout Time</a>
				}	
			} 
		})

		this.setState({
			navDivs: navbarDivs
		});
	}

	render() {
		return (
			<div className="PageNavbar">
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
			      <span className="navbar-brand center">Music App</span>
			      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
			        <div className="navbar-nav">
								{this.state.navDivs}
								<NavDropdown title="Profile" id="basic-nav-dropdown">
									<NavDropdown.Item href="#action/3.1">Logout</NavDropdown.Item>
								</NavDropdown>
			        </div>
			      </div>
			    </nav>
			</div>
        );
	}
}