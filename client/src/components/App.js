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
import Landing from './Landing';
import {withCookies} from 'react-cookie';

const authUtil = {
	needsRefresh: true,
	setRefresh(bool) {
		if (bool) {
			this.needsRefresh = true;
		} else {
			this.needsRefresh = false;
		}
	},
	checkAuth(cookies) {
		if (cookies.get('access_token') && !this.needsRefresh) {
			return true
		} else {
			return false
		}
	},
	getAuth() {
		fetch("http://localhost:8081/ugh this",
        {
          method: 'GET' // The type of HTTP request.
        }).then(res => {
					// Convert the response data to a JSON.
					setTimeout(setRefresh(true), 3600)
          return res.json();
        }, err => {
          // Print the error if there is one.
          console.log(err);
        })
		
	},
	signout() {
		this.needsRefresh = true
	}
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    authUtil.checkAuth(props)
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

class App extends React.Component {

	render() {
		authUtil.checkAuth(this.props)
		console.log(cookies.get('access_token'))
		return (
			<div className="App">
				<Router>
					<Switch>
						<PrivateRoute path='/recommendations' component={Recommendations} />
						<PrivateRoute path='/time' component={Time} />
						<PrivateRoute path='/playlists' component={YourPlaylists} />
						<Route path="/" render={() => (<Landing />)}/>
						<Route path="/logout" />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default withCookies(App);