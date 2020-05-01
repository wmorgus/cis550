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

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route exact path="/" render={() => (
								<YourPlaylists />
							)}
						/>
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
					</Switch>
				</Router>
			</div>
		);
	}
}