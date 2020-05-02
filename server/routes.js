var config = require('./db-config.js');
const request = require('request');
var oracle = require('oracledb');

var conn;

/****       oracle helper funcs          ****/

async function initDB() {
  console.log('initingdb')
  conn = await oracle.getConnection(config.dbpool);
  console.log('initdone')
}

async function closeDB(cb) {
  conn.close(function(err) {
    cb();
  })
}


/****       spotify api key mgmt          ****/

function login(req, res) {
  if (req.cookies.refresh_token) {
    //https://accounts.spotify.com/api/token
    var formBody = 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(req.cookies.refresh_token);
    var b = new Buffer(config.spotifyConfig.spotifyClientID + ':' + config.spotifyConfig.spotifyClientSecret);
    var authStr = b.toString('base64');
		var reqOps = {
			uri: 'https://accounts.spotify.com/api/token',
			body: formBody,
			method: 'POST',
			headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': 'Basic ' +  authStr
			}
		}
		request(reqOps, function (error, response){
			if (response.body) {
				var res2 = JSON.parse(response.body);
				if (res2.access_token) {
					var token = res2.access_token;
					var expires = res2.expires_in;
					//here, set cookie for client with api token
          res.cookie('access_token', token, {maxAge: expires * 1000});
					res.redirect('http://localhost:3000/')
				} else {
					console.log("error with accessing token")
					console.log(res2.error_description)
				}
			} else {
				console.log("error with refresh request")
			}});
  } else {
    var scopes = 'user-read-private user-read-email playlist-read-private user-library-read streaming';
    var redirect_uri = "http://localhost:8081/storeCode"; //replace with address
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + encodeURIComponent(config.spotifyConfig.spotifyClientID) +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri));
  }
}

function storeCode(req, res) {
  if (req.query.code) {
		var redirect_uri = "http://localhost:8081/storeCode";
		var formBody = 'grant_type=authorization_code&code=' + encodeURIComponent(req.query.code) + '&redirect_uri=' + encodeURIComponent(redirect_uri);
		formBody = formBody + '&client_id=' + encodeURIComponent(config.spotifyConfig.spotifyClientID) + '&client_secret=' + encodeURIComponent(config.spotifyConfig.spotifyClientSecret);
		var reqOps = {
			uri: 'https://accounts.spotify.com/api/token',
			body: formBody,
			method: 'POST',
			headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			}
		}
		request(reqOps, function (error, response){
			if (response.body) {
				var res2 = JSON.parse(response.body);
				if (res2.access_token) {
					var token = res2.access_token;
					var expires = res2.expires_in;
					var refresh = res2.refresh_token;
					//here, set cookie for client with api token
					console.log(token)
					console.log(expires)
          console.log(refresh)
          res.cookie('access_token', token, {maxAge: expires * 1000});
          res.cookie('refresh_token', refresh)
					res.redirect('http://localhost:3000/')
				} else {
					console.log("error with accessing token")
					console.log(res2.error_description)
				}
			} else {
				console.log("error with token request")
			}});
	} else {
		console.log(req.query.error)
		res.redirect('http://localhost:3000/login')
	}
}

function totalRestart(req, res) {
  console.log(req.cookies)
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.clearCookie('expires')
  res.redirect('http://localhost:3000/landing');
}

function logout(req, res) {
  res.clearCookie('access_token');
  res.redirect('http://localhost:3000/landing')
}


/****       spotify api requests          ****/

function getAllPlaylists(req, res) {
  var offset = 0
  if (req.body.offset) {
    offset = req.query.offset
  }
  var reqOps = {
    uri: 'https://api.spotify.com/v1/me/playlists?offset=' + offset,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + req.query.apikey
    }
  }
  request(reqOps, function (error, response){
    if (response.body) {
      var res2 = JSON.parse(response.body);
      console.log(res2)
      if (res2) {
        res.send(JSON.stringify(res2))
      } else {
        console.log("error with accessing playlists")
        console.log(res2.error_description)
      }
    } else {
      console.log("error with playlists request")
    }});
}

function getPlaylist(req, res) {
  var offset = 0
  if (req.body.offset) {
    offset = req.body.offset
  }
  var reqOps = {
    uri: 'https://api.spotify.com/v1/playlists/' + req.body.playlistID,
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + req.cookies.access_token
    }
  }
  request(reqOps, function (error, response){
    if (response.body) {
      var res2 = JSON.parse(response.body);
      if (res2.items) {
        var playlist = res2.items
        console.log(items)
        res.send(JSON.stringify(items))
      } else {
        console.log("error with accessing playlist")
        console.log(res2.error_description)
      }
    } else {
      console.log("error with playlist request")
    }});
}

function getSong(req, res) {
  var reqOps = {
    uri: 'https://api.spotify.com/v1/track/' + req.query.songID,
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + req.cookies.access_token
    }
  }
  request(reqOps, function (error, response){
    if (response.body) {
      var res2 = JSON.parse(response.body);
      if (res2.items) {
        var playlists = res2.items
        console.log(items)
        res.send(JSON.stringify(items))
      } else {
        console.log("error with accessing song")
        console.log(res2.error_description)
      }
    } else {
      console.log("error with song request")
    }});
}

function getUser(req, res) {
  var reqOps = {
    uri: 'https://api.spotify.com/v1/me/',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + req.query.apikey
    }
  }
  request(reqOps, function (err, response){
    if (response.body) {
      var res2 = JSON.parse(response.body);
      console.log(res2)
      if (res2) {
        res.json(res2)
      } else {
        console.log("error with accessing user")
        console.log(res2.error_description)
      }
    } else {
      console.log("error with user request")
  }});
}


/* ---- Playlist Rec Routes ---- */

function getRecommendations(req, res) {
  
  getAllPlaylists(req, res);
/*
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  */
};

function getRecsFromPlaylist(req, res) {
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getFollowPlaylists(req, res) {
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};



function getTopSongsFrom(req, res) {
  console.log("params");
  console.log(req.params.date);
  var date = req.params.date.split("_");
  query = "SELECT title, artists, streams FROM (SELECT * FROM Top_Songs WHERE day = " + 
  date[1] + " AND month = " + date[0] + " AND year = " + date[2] + " ORDER BY streams DESC) a" +
  " JOIN All_Songs ON All_Songs.SID = a.sid";
  console.log(query);
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    res.send(JSON.stringify(result));
  });
};

function getMonthlyArtists(req, res) {
  console.log("params");
  console.log(req.params.date);
  var date = req.params.date.split("_");

  query = "WITH AllStreams AS (SELECT SUM(streams) as allstreams FROM Top_Songs WHERE year = " + date[1] + " AND month = " + date[0] + ")" +
  "SELECT artists, totalstreams, totalstreams/allstreams AS percentage " + 
  "FROM (SELECT artists, SUM(streams) as totalStreams FROM (SELECT * FROM Top_Songs WHERE year = " + date[1] + " AND month = " +
  date[0] + " ) Month JOIN All_Songs ON Month.sid = All_Songs.sid GROUP BY artists ORDER BY totalStreams desc) x, AllStreams WHERE ROWNUM <= 10"
  console.log(query);
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    console.log(result);
    res.send(JSON.stringify(result));
  });
};

function getDBTest(req, res) {
  console.log('reqqing')
  var query = 'SELECT COUNT(*) FROM ALL_SONGS'
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(result.rows);
  });
};

function getStreakSids(req, res) {
  query = "SELECT a.SID as SID, title, artists FROM (SELECT DISTINCT SID FROM top_songs) a JOIN all_songs ON a.sid = all_songs.SID";
  console.log(query);
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    res.send(JSON.stringify(result));
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  initDB,
  closeDB,
  login, 
  logout,
  totalRestart,
  storeCode,
  getAllPlaylists,
  getPlaylist,
  getSong,
  getUser,
  getFollowPlaylists,
  getRecommendations,
  getRecsFromPlaylist,
  getTopSongsFrom,
  getDBTest,
  getMonthlyArtists,
  getStreakSids,
}