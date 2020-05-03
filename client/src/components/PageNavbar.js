import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown, ButtonGroup, Dropdown} from 'react-bootstrap';

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		}
	}

	componentDidMount() {
		const pageList=['yourPlaylists', 'recommendations', 'time']
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
					return <a className="nav-item nav-link active" key={i} href="/recommendations">Recommendations</a>
				} else {
					return <a className="nav-item nav-link" key={i} href="/recommendations">Recommendations</a>
				}
			} else if (i === 2) {
				if (this.props.active === page) {
					return <a className="nav-item nav-link active" key={i} href="/time">Songs Throughout Time</a>
				} else {
					return <a className="nav-item nav-link" key={i} href="/time">Songs Throughout Time</a>
				}	
			} 
		})
		var name = 'defaultname'
		var picUrl = 'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1-744x744.jpg'
		
		fetch('http://localhost:8081/spotify/getUser?apikey=' + this.props.apikey).then(response => response.json()).then((data) => {
			console.log(data)
			name = data.display_name
			if(data.images) {
				if (data.images.length > 0) {
					picUrl = data.images[data.images.length - 1]
				}
			}
			console.log(name)
			console.log(picUrl)
		}).finally(() => {
			this.setState({
				navDivs: navbarDivs,
				name: name,
				picUrl: picUrl
			});
		});
	}

	render() {
		return (
			<Navbar bg="secondary" expand="lg" sticky="top">
				<Navbar.Brand><b>Spotify.<span style={{color: "#22c3dd"}}>Smarter</span></b></Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						{this.state.navDivs}
					</Nav>
					<Nav>

					<Dropdown as={ButtonGroup}>
						<Dropdown.Toggle id="dropdown-split-basic" style={{background: "transparent", border: "#333333"}}>
							<div className="container-flex" style={{height: "80%"}}> 
								<img className="img-thumbnail" 
									src={this.state.picUrl} 
									alt="User pic"
									width="35"
									height="35"
									className="d-inline-block align-center"
									style={{marginRight: "10px"}}
								/>
								<Navbar.Text>
								Logged in as: {this.state.name}
								</Navbar.Text>
							</div>
						</Dropdown.Toggle>
					
						<Dropdown.Menu style={{color: "#ff00ff", width: '100%'}}>
							<Dropdown.Item href="http://localhost:8081/logout">Logout</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
						{/* <Dropdown.Toggle split variant="success" id="dropdown-split-basic" /> */}

					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}