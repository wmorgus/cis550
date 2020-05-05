const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var routes = require("./routes.js");




var app = express();

app.use(cors({credentials: true, origin: 'http://ec2-54-89-146-102.compute-1.amazonaws.com:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(function(req, res, next) {
	console.log(req.method + ': ' + req.url)
	next()
})

app.get('/login', routes.login);
app.get('/storeCode', routes.storeCode);
app.get('/logout', routes.logout);
app.get('/totalRestart', routes.totalRestart);

app.get('/spotify/getPlaylists', routes.getAllPlaylists);
app.get('/spotify/getUserPlaylists', routes.getUserPlaylists);
app.get('/spotify/getPlaylist', function(req, res) {
	routes.getPlaylist(req, res, app)
});
app.get('/spotify/getJustPlaylist', routes.onlyAPlaylist);

app.get('/spotify/getSong', routes.getSong);
app.get('/spotify/getUser', routes.getUser);


app.get('/recommendations/avg/:pid', routes.getAverageFeatures);
app.get('/recommendations/tracks/:pid', routes.getTracklist);
app.get('/checkQueue', function(req, res) {
	routes.checkQueue(req, res, app)
});
app.get('/queryTesterOut', routes.queryTesterOut);

app.get('/recommendations/bysong', routes.getRecsSimilarSongs);
app.get('/recommendations/byplaylist/:pid', routes.getRecsSimilarPlaylists);
app.get('/recommendations/bypopular', routes.getRecsPopular);

app.get('/topsongsfrom/:date', routes.getTopSongsFrom);
app.get('/monthlyartists/:date', routes.getMonthlyArtists);
app.get('/longeststreak/:sid', routes.getLongestStreak);
app.get('/streaksids', routes.getStreakSids);
app.get('/acoustics', routes.getAcoustics);
app.get('/playlistacoustics/:oid', routes.getPlaylistAcoustics);
app.get('/playlistdance/:oid', routes.getPlaylistDance);
app.get('/playlistenergy/:oid', routes.getPlaylistEnergy);
app.get('/duration/:pid', routes.getDuration);


var server = app.listen(8081, () => {
	routes.initDB(app)
	app.set('uploadQ', [])
	console.log('Server listening on PORT 8081');
});

process.on('SIGINT', function() {
	console.log('would you like to hear a song, dave?')
  server.close(function() {
		routes.closeDB(() => {process.exit(0);});
  });
});