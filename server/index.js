const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var routes = require("./routes.js");




const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/login', routes.login);
app.get('/storeCode', routes.storeCode);
app.get('/logout', routes.logout);

app.get('/spotify/getPlaylists', routes.getAllPlaylists);
app.get('/spotify/getPlaylist', routes.getPlaylist);
app.get('/spotify/getSong', routes.getSong);

app.get('/yourplaylists', routes.getYourPlaylists);
app.get('/followPlaylists', routes.getFollowPlaylists);
app.get('/recommendations', routes.getRecommendations);
app.get('/time', routes.getTime);

app.get('/testdb', routes.getDBTest);

var server = app.listen(8081, () => {
	routes.initDB()
	console.log('Server listening on PORT 8081');
});

process.on('SIGINT', function() {
	console.log('would you like to hear a song, dave?')
  server.close(function() {
		routes.closeDB(() => {process.exit(0);});
  });
});