import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown} from 'react-bootstrap';

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
			<div className="PageNavbar">
				<Navbar bg="light" expand="lg">
			      <Navbar.Brand><b>Spotify.Smarter</b></Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
			      <Navbar.Collapse id="basic-navbar-nav">
			        <Nav className="mr-auto">
								{this.state.navDivs}
							</Nav>
							<Nav style={{marginRight: ""}}>
									
								<NavDropdown title={
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
									} id="basic-nav-dropdown">
									<NavDropdown.Item href="http://localhost:8081/logout">Logout</NavDropdown.Item>
								</NavDropdown>
							</Nav>
			      </Navbar.Collapse>
			    </Navbar>
			</div>
        );
	}
}