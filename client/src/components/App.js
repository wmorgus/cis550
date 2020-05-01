import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import {withCookies} from 'react-cookie';

import YourPlaylists from './YourPlaylists';
import FollowPlaylists from './FollowPlaylists';
import Recommendations from './Recommendations';
import Time from './Time';
import Landing from './Landing';

var checkAuth = function(cookieObj) {
	//i know this isn't great, but it's my failsafe way to ensure no crashes
	if (cookieObj && cookieObj.allCookies && cookieObj.allCookies.access_token) {
		return true
	} else {
		return false
	}
}

const PrivateRoute = ({ component: Component, cookies: Cookies, ...rest }) => (
  <Route {...rest} render={(props) => {
		console.log(Cookies)
		return (checkAuth(Cookies)
      ? <Component {...props} />
      : <Redirect to='/landing' />
  )}} />
)

class App extends React.Component {

	render() {
		var cookies = this.props
		return (
			<div className="App">
				<Router>
					<Switch>
						<PrivateRoute path='/recommendations' component={Recommendations} cookies={cookies} />
						<PrivateRoute path='/time' component={Time} cookies={cookies} />
						<Route path="/landing" render={() => (<Landing />)}/>
						<PrivateRoute path='/' component={YourPlaylists} cookies={cookies} />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default withCookies(App);