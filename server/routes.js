var config = require('./db-config.js');
const request = require('request');
var oracle = require('oracledb');

var conn;

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


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

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

function logout(req, res) {
  res.clearCookie('access_token');
  res.redirect('http://localhost:3000/landing')
}

function getAllPlaylists(req, res) {
  var offset = 0
  if (req.body.offset) {
    offset = req.body.offset
  }
  var reqOps = {
    uri: 'https://api.spotify.com/v1/me/playlists?offset=' + offset,
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
    uri: 'https://api.spotify.com/v1/track/' + req.body.songID,
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


/* ---- Playlist Rec Routes ---- */






/* ---- Q1a (Dashboard) ---- */
function getAllGenres(req, res) {
  var query = `
    SELECT DISTINCT genre
    FROM Genres
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- Q1b (Dashboard) ---- */
function getTopInGenre(req, res) {
  var query = `
    SELECT title, rating, vote_count
    FROM Genres g JOIN Movies m ON m.id = g.movie_id
    WHERE g.genre='` + req.params.genre + `'
    ORDER BY rating DESC, vote_count DESC
    LIMIT 10
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


/* ---- Q2 (Recommendations) ---- */
function getRecs(req, res) {
  var query = `
    WITH q_genres AS (SELECT genre FROM Genres g1 JOIN Movies m1 ON g1.movie_id = m1.id WHERE m1.title = '` + req.params.title + `')
    SELECT DISTINCT title, id, rating, vote_count
    FROM Genres g JOIN Movies m ON m.id = g.movie_id
    WHERE title <> '` + req.params.title + `' AND genre IN (SELECT * FROM q_genres)
    GROUP BY title, id, rating, vote_count
    HAVING COUNT(*) > (SELECT COUNT(*) FROM q_genres) -1
    ORDER BY rating DESC, vote_count DESC
    LIMIT 5;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- (Best Genres) ---- */
function getDecades(req, res) {
	var query = `
    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
    FROM (
      SELECT DISTINCT release_year as year
      FROM Movies
      ORDER BY release_year
    ) y
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Q3 (Best Genres) ---- */
function bestGenresPerDecade(req, res) {
  //req.params.decade
  var query = `
    WITH 
    all_genres AS (SELECT DISTINCT genre FROM Genres),
    decade_genres AS (
      SELECT g.genre AS d_genre, m.rating FROM Genres g JOIN Movies m ON g.movie_id = m.id WHERE FLOOR(FLOOR(m.release_year/10)*10) = ` + req.params.decade + `
    )
    SELECT genre, AVG(rating) AS avg_rating
    FROM all_genres LEFT JOIN decade_genres ON all_genres.genre = decade_genres.d_genre
    GROUP BY genre
    ORDER BY AVG(rating) DESC, genre
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


//
/* ---- Q3 (Best Genres) ---- */
function posters(req, res) {
  var query = `
    SELECT title
    FROM Movies
    ORDER BY RAND ()
    LIMIT 23
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      var baseURL = 'http://www.omdbapi.com/?apikey=b09d5432&t='
      var rets = []
      var i = 0;
      for (curr in rows) {
        i++;
        if (rows[i]) {
          var title = rows[i].title
          var temp = baseURL + title.replace(/ /g,"+")
          request(temp, { json: true }, (err, res2, body) => {
            if (err) {
              return console.log(err); 
            } else {
              if (res2.body.Response == 'True') {
                rets.push(res2.body);
              }
              if (rets.length == 15) {
                res.send(rets);
              }
            }
          });
        }
      }
      
    }
    
  });
};

function getYourPlaylists(req, res) {
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

function getRecommendations(req, res) {
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getTime(req, res) {
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(result.rows);
  });
};

function getTopSongsFrom(req, res) {
  console.log("params");
  console.log(req.params.date);
  var date = req.params.date.split("_");
  var month = date[0];
  var day = date[1];
  var year = date[2];
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

// The exported functions, which can be accessed in index.js.
module.exports = {
  login, 
  logout,
  initDB,
  closeDB,
  storeCode,
  getAllPlaylists,
  getPlaylist,
  getSong,
  getYourPlaylists,
  getFollowPlaylists,
  getRecommendations,
  getTime,
  getTopSongsFrom,
  getDBTest,
}