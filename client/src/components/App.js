import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import {withCookies} from 'react-cookie';

import YourPlaylists from './YourPlaylists';
import Playlist from './Playlist'
import Recommendations from './Recommendations';
import RecPlaylist from './RecPlaylist';
import DatabasePlaylist from './DatabasePlaylist';
import Time from './Time';
import MonthlyArtists from './MonthlyArtists';
import TopSongs from './TopSongs';
import LongestStreak from './LongestStreak';
import LineGraph from './LineGraph';
import PlaylistComparison from './PlaylistComparison';
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
		if (checkAuth(Cookies)) {
			props.apikey = Cookies.allCookies.access_token
			return(<Component {...props} />)
		} else {
			return(<Redirect to='/landing' />)
		}
  }}/>
)

class App extends React.Component {

	render() {
		var cookies = this.props
		return (
			<div className="App">
				<Router>
					<Switch>
						<PrivateRoute path='/recommendations/results/:id' component={DatabasePlaylist} cookies={cookies} />
						<PrivateRoute path='/recommendations/:id' component={RecPlaylist} cookies={cookies} />
						<PrivateRoute path='/recommendations' component={Recommendations} cookies={cookies} />
						<PrivateRoute path='/time' component={Time} cookies={cookies} />
						<PrivateRoute path='/playlist/:id' component={Playlist} cookies={cookies} />
						<PrivateRoute path='/monthlyartists' component={MonthlyArtists} cookies={cookies} />
						<PrivateRoute path='/topsongs' component={TopSongs} cookies={cookies} />
						<PrivateRoute path='/longeststreak' component={LongestStreak} cookies={cookies} />
						<PrivateRoute path='/playlistcomparison' component={PlaylistComparison} cookies={cookies} />
						<PrivateRoute path='/graphs' component={LineGraph} cookies={cookies} />
						<Route path="/landing" render={() => (<Landing />)}/>
						<PrivateRoute path='/' component={YourPlaylists} cookies={cookies} />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default withCookies(App);