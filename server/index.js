const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */


app.get('/login', function(req, res) {
	var scopes = 'user-read-private user-read-email playlist-read-private user-library-read streaming';
	var redirect_uri = "http%3A%2F%2Flocalhost:3000%2F"; //replace with address
	res.redirect('https://accounts.spotify.com/authorize' +
		'?response_type=code' +
		'&client_id=' + my_client_id +
		(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
		'&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.get('/storeCode', function(req, res) { //parameter state is userID
	var scopes = 'user-read-private user-read-email playlist-read-private user-library-read streaming';
	var redirect_uri = "http%3A%2F%2Flocalhost:3000%2F"; //replace with address
	res.redirect('https://accounts.spotify.com/authorize' +
		'?response_type=code' +
		'&client_id=' + my_client_id +
		(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
		'&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.get('/genres', routes.getAllGenres);
app.get('/genres/:genre', routes.getTopInGenre);
app.get('/recs/:title', routes.getRecs);
app.get('/decades', routes.getDecades);
app.get('/decades/:decade', routes.bestGenresPerDecade);
app.get('/posters', routes.posters);






app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});