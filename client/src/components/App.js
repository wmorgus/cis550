import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import YourPlaylists from './YourPlaylists';
import FollowPlaylists from './FollowPlaylists';
import Recommendations from './Recommendations';
import Time from './Time';
import {withCookies} from 'react-cookie';

const fakeAuth = {
	isAuthenticated: false,
	authenticate(cb) {
		this.isAuthenticated = true
		setTimeout(cb, 100) // fake async
	},
	signout(cb) {
		this.isAuthenticated = false
		setTimeout(cb, 100) // fake async
	}
}

class App extends React.Component {

	render() {
		const {cookies} = this.props;
		console.log(cookies.get('access_token'))
		if (cookies.get('access_token') == '') {
			 //login
		} else {
			return (
				<div className="App">
					<Router>
						<Switch>
							<Route exact path="/followPlaylists" render={() => (
									<FollowPlaylists />
								)}
							/>
							<Route exact path="/recommendations" render={() => (
									<Recommendations />
								)}
							/>
							<Route exact path="/time" render={() => (
									<Time />
								)}
							/>
							<Route path="/" render={() => (
									<YourPlaylists />
								)}
							/>
						</Switch>
					</Router>
				</div>
			);
		}
	}
}

export default withCookies(App);