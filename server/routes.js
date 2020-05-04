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
			if (response && response.body) {
				var res2 = JSON.parse(response.body);
				if (res2.access_token) {
					var token = res2.access_token;
					var expires = res2.expires_in;
					var refresh = res2.refresh_token;
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
		console.log(error)
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
  if (req.query.offset) {
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
    if (response && response.body) {
      var res2 = JSON.parse(response.body);
      // console.log(res2)
      if (res2) {
        res.send(JSON.stringify(res2))
      } else {
        console.log("error with accessing playlists")
        console.log(res2.error_description)
      }
    } else {
      console.log("error with playlists request")
      console.log(error)
    }});
}

function getUserPlaylists(req, res) {
  var offset = 0
  if (req.query.offset) {
    offset = req.query.offset
  }//https://api.spotify.com/v1/users/willmorgus/playlists?offset=0&limit=20
  var reqOps = {
    uri: 'https://api.spotify.com/v1/users/' + req.query.user + '/playlists?offset=' + offset,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + req.query.apikey
    }
  }

  request(reqOps, function (error, response){
    if (response && response.body) {
      var res2 = JSON.parse(response.body);
      // console.log(res2)
      if (res2) {
        res.send(JSON.stringify(res2))
      } else {
        console.log("error with accessing playlists")
        console.log(res2.error_description)
      }
    } else {
      console.log(error)
      console.log("error with playlists request")
  }});
}

function recursiveReq(reqOps, addTo, cb) {
  request(reqOps, function (error, response){
    if (response && response.body) {
      var res2 = JSON.parse(response.body);
      if (res2) {
        console.log(res2)
        if (addTo.length == 0) {
          cb = partial(cb, res2)
        }
        if (res2.tracks) {
          for (var ind in res2.tracks.items) {
            addTo.push(res2.tracks.items[ind].track)
          }
        } else {
          for (var ind in res2.items) {
            addTo.push(res2.items[ind].track)
          }
        }
        if ((res2.tracks && res2.tracks.next) || res2.next) {
          if (res2.tracks) {
            reqOps.uri = res2.tracks.next
            recursiveReq(reqOps, addTo, cb) 
          } else {
            reqOps.uri = res2.next
            recursiveReq(reqOps, addTo, cb) 
          }
        } else {
          cb(addTo, res2)
        }
      } else {
        console.log("error with accessing playlist")
        console.log(res2.error_description)
      }
    } else {
      console.log(error)
      console.log("error with playlist request")
    }});

}

function completeRecursion(id, res, obj, output) {
  //call leems function here with id and output
  obj.allSongs = output
  res.send(obj)
}

function getMore() {

}

//thank god for github
function partial(f) {
  var args = Array.prototype.slice.call(arguments, 1)
  return function() {
    var remainingArgs = Array.prototype.slice.call(arguments)
    return f.apply(null, args.concat(remainingArgs))
  }
}

function getPlaylist(req, res) {
  var reqOps = {
    uri: 'https://api.spotify.com/v1/playlists/' + req.query.id,
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + req.query.apikey
    }
  }
  recursiveReq(reqOps, [], partial(completeRecursion, req.query.id, res));
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
        // console.log(items)
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
    if (response && response.body) {
      var res2 = JSON.parse(response.body);
      // console.log(res2)
      if (res2) {
        res.json(res2)
      } else {
        console.log("error with accessing user")
        console.log(res2.error_description)
      }
    } else {
      console.log(err)
      console.log("error with user request")
  }});
}


/* ---- Playlist Rec Routes ---- */

function getAverageFeatures(req, res) {
  console.log('finding average attributes for ' + req.params.pid)
  var playlist = req.params.pid
  console.log('avg pid found ' + playlist)
  query = "WITH PlaylistData AS (SELECT pid, sid FROM Playlist_Songs WHERE pid = '" + {playlist} + "') " + 
  "SELECT pid, AVG(energy) as energy, AVG(danceability) as danceability, AVG(loudness) as loudness, " +
  "AVG(acousticness) as acousticness, AVG(valence) as valence " +
  "FROM PlaylistData JOIN All_Songs ON PlaylistData.sid = All_Songs.sid " +
  "GROUP BY pid"
  

  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    console.log('look here, dummy')
    console.log(result);
    res.send(JSON.stringify(result));
  });
};

//use Spotify audio features to generate a new playlist
//by querying for songs with qualities similar to the selected user playlist
function getRecsSimilarSongs(req, res) {
  var testPID = '1055milplay'
  var song = "4CUCBqTA74rmKu4mEgD6QH"
  console.log('finding similar songs')

  //build query
  var buildQuery = ""


  query = "WITH basis AS (SELECT sid FROM Playlist_Songs WHERE pid = pidVariable) " + 
  "SELECT distinct sid, title, artists, album" + 
  "FROM all_songs, vals" + 
  "WHERE AND all_songs.sid NOT IN basis" + buildQuery
  
  
  
  /*query = "WITH vals(min_energy, max_energy, min_dance, max_dance) as ( " + 
    "SELECT (alls.energy-.01) AS min_energy, (alls.energy+.01) AS max_energy, " + 
    "(alls.danceability-.01) AS min_dance, (alls.danceability+.01) AS max_dance " + 
    "FROM playlist_songs ps " + 
    "JOIN all_songs alls ON alls.sid = ps.sid " + 
    "WHERE ps.sid = '7upxcSIbWaeiS3mom33Bee') " + 
    "SELECT distinct sid, title, artists, album " + 
    "FROM all_songs, vals " + 
    "WHERE all_songs.energy BETWEEN vals.min_energy AND vals.max_energy " + 
    "AND all_songs.danceability BETWEEN vals.min_dance AND vals.max_dance " + 
    "AND all_songs.sid <> '7upxcSIbWaeiS3mom33Bee'"
    */

    conn.execute(query, function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      } 
      console.log(result);
      res.send(JSON.stringify(result));
    });
};

//query for existing playlists that are similar to the selected user playlist
//that the user isn't already following
function getRecsSimilarPlaylists(req, res) {
  console.log('finding similar playlists')
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

////use Spotify audio features to generate a new playlist
//by querying for top 100 songs with qualities similar to the selected user playlist
function getRecsPopular(req, res) {
  console.log('finding similar popular songs')
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- Songs vs Time Routes ---- */

function getTopSongsFrom(req, res) {
  var date = req.params.date.split("_");
  query = "SELECT title, artists, streams FROM (SELECT * FROM Top_Songs WHERE day = " + 
  date[1] + " AND month = " + date[0] + " AND year = " + date[2] + " ORDER BY streams DESC) a" +
  " JOIN All_Songs ON All_Songs.SID = a.sid";
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    console.log(result);
    res.send(JSON.stringify(result));
  });
};

function getMonthlyArtists(req, res) {
  var date = req.params.date.split("_");

  query = "WITH AllStreams AS (SELECT SUM(streams) as allstreams FROM Top_Songs WHERE year = " + date[1] + " AND month = " + date[0] + ")" +
  "SELECT artists, totalstreams, totalstreams/allstreams AS percentage " + 
  "FROM (SELECT artists, SUM(streams) as totalStreams FROM (SELECT * FROM Top_Songs WHERE year = " + date[1] + " AND month = " +
  date[0] + " ) Month JOIN All_Songs ON Month.sid = All_Songs.sid GROUP BY artists ORDER BY totalStreams desc) x, AllStreams WHERE ROWNUM <= 10"
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    console.log(result);
    res.send(JSON.stringify(result));
  });
};


function getStreakSids(req, res) {
  query = "SELECT a.SID as SID, title, artists FROM (SELECT DISTINCT SID FROM top_songs) a JOIN all_songs ON a.sid = all_songs.SID";
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    res.send(JSON.stringify(result));
  });
};

function getLongestStreak(req, res) {
  query = "with g(instance_date) as ( select to_date(to_char(year, 'FM0000') || to_char(month, 'FM00') || to_char(day, 'FM00'), 'YYYYMMDD') as d " +
    "from top_songs where sid = '" + req.params.sid + "' ), temp(rn, grp, instance_date) as (select row_number() over (order by instance_date), " +
    "instance_date - row_number() over (order by instance_date) as grp, instance_date from g), temp2 as ( " +
    "select count(*) as days, min(instance_date), max(instance_date) from temp group by grp order by 1 desc, 2 desc) select * from temp2 where rownum = 1"
    
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    console.log(result);
    res.send(JSON.stringify(result));
  });
};

function getAcoustics(req, res) {

  query = "WITH info AS (SELECT tops.sid as sid, acousticness, energy, danceability FROM (SELECT DISTINCT SID FROM TOP_SONGS) tops " + 
  "JOIN all_songs ON tops.sid = all_songs.sid), DataSum AS " +
  " (SELECT month, year, SUM(acousticness) as asums, SUM(energy) as esums, SUM(danceability) as dsums FROM info " +
  "JOIN top_songs ON info.sid = top_songs.sid  GROUP BY month, year ORDER BY YEAR ASC, MONTH ASC), " +
"largestSum AS (SELECT MAX(asums) as maxasum, MAX(esums) as maxesum, MAX(dsums) as maxdsum FROM DataSum) " + 
"SELECT (asums / maxasum) as asum, (dsums / maxdsum) as dsum, (esums / maxesum) as esum FROM DataSum, largestSum";
    
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

function getPlaylistValidation(sids, pid, oid) {
  query = "SELECT COUNT(*) FROM Playlist_Owner WHERE pid = " + pid;
  var ret = "";
  //check if there is a playlist with this id 
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(result);
    if (result == 0) {
      //there is no playlist by that name, check each song in all_songs
      query = "INSERT INTO playlist_owner(pid, oid) " + 
      "VALUES (" + pid + ", " + oid + ")";
      conn.execute(query, function(err, result) {
          if (err) {
            console.error(err.message);
            return;
          } 
          sids.forEach(function(element) {
            query = "SELECT COUNT(*) FROM All_Songs WHERE sid = " + element;
              conn.execute(query, function(err, result) {
              if (err) {
                console.error(err.message);
                return;
              } 
              console.log(result);
              if (result == 0) {
                // this is a new song for all_songs, wowwie 
                query = "INSERT INTO all_songs (sid, title, album, artists, energy, danceability, loudness, tempo, acousticness, duration_ms, valence) " + 
                "VALUES (" + "TODO" + ")";
                conn.execute(query, function(err, result) {
                  if (err) {
                    console.error(err.message);
                    return;
                  } 
                  console.log(result);
                  query = "INSERT INTO playlist_songs(sid, pid) " + 
                  "VALUES (" + element + ", " + pid + ")";
                  //insert every song into our new playlist
                  conn.execute(query, function(err, result) {
                    if (err) {
                      console.error(err.message);
                      return;
                    } 
                    console.log(result);
                  });
                });
            } else {
              query = "INSERT INTO playlist_songs(sid, pid) " + 
              "VALUES (" + element + ", " + pid + ")";
              //insert every song into our new playlist
              conn.execute(query, function(err, result) {
                if (err) {
                  console.error(err.message);
                  return;
                } 
                console.log(result);
              });
            }
          });
        });
      });
    } else {
      //this playlist is already in the system
      query = "SELECT * FROM Playlist_Songs WHERE pid = " + pid;
      conn.execute(query, function(err, result) {
          if (err) {
            console.error(err.message);
            return;
          } 
          sids.forEach(function(element) {
            if (!result.includes(element)) {
              // this song is new to the playlist
              query = "SELECT COUNT(*) FROM All_Songs WHERE sid = " + element;
              conn.execute(query, function(err, result) {
              if (err) {
                console.error(err.message);
                return;
              } 
              console.log(result);
              if (result == 0) {
                //new song is not in all_songs
                query = "INSERT INTO all_songs (sid, title, album, artists, energy, danceability, loudness, tempo, acousticness, duration_ms, valence) " + 
                "VALUES (" + "TODO" + ")";
                conn.execute(query, function(err, result) {
                  if (err) {
                    console.error(err.message);
                    return;
                  } 
                  console.log(result);
                  query = "INSERT INTO playlist_songs(sid, pid) " + 
                  "VALUES (" + element + ", " + pid + ")";
                  //insert every song into our new playlist
                  conn.execute(query, function(err, result) {
                    if (err) {
                      console.error(err.message);
                      return;
                    } 
                    console.log(result);
                  });
                });
            } else {
              query = "INSERT INTO playlist_songs(sid, pid) " + 
              "VALUES (" + element + ", " + pid + ")";
              //insert every song into our new playlist
              conn.execute(query, function(err, result) {
                if (err) {
                  console.error(err.message);
                  return;
                } 
                console.log(result);
              });
            }
            });
            }
          });
          result.forEach(function(element) {
            if (!sids.includes(element)) {
              // if element not in sids, we must delete
              query = "DELETE playlist_songs WHERE sid = " + element +  " AND pid = " + pid;
              conn.execute(query, function(err, result) {
                if (err) {
                  console.error(err.message);
                  return;
                } 
                console.log(result);
              });
            }
          });
      });
    }
  });
};


function getPlaylistAcoustics(req, res) {

  query = "WITH Playlists AS (SELECT pid FROM playlist_owner WHERE oid = '" + req.params.oid + "')," + 
  " PlaylistData AS (SELECT Playlists.pid, sid FROM Playlists JOIN Playlist_Songs ON Playlists.pid = Playlist_Songs.pid) " + 
  "SELECT pid, AVG(acousticness) as avg FROM PlaylistData JOIN All_Songs ON PlaylistData.sid = All_Songs.sid GROUP BY pid ORDER BY avg DESC";
  
    
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


function getPlaylistDance(req, res) {

  query = "WITH Playlists AS (SELECT pid FROM playlist_owner WHERE oid = '" + req.params.oid + "')," + 
  " PlaylistData AS (SELECT Playlists.pid, sid FROM Playlists JOIN Playlist_Songs ON Playlists.pid = Playlist_Songs.pid) " + 
  "SELECT pid, AVG(danceability) as avg FROM PlaylistData JOIN All_Songs ON PlaylistData.sid = All_Songs.sid GROUP BY pid ORDER BY avg DESC";
  
    
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


function getPlaylistEnergy(req, res) {

  query = "WITH Playlists AS (SELECT pid FROM playlist_owner WHERE oid = '" + req.params.oid + "')," + 
  " PlaylistData AS (SELECT Playlists.pid, sid FROM Playlists JOIN Playlist_Songs ON Playlists.pid = Playlist_Songs.pid) " + 
  "SELECT pid, AVG(energy) as avg FROM PlaylistData JOIN All_Songs ON PlaylistData.sid = All_Songs.sid GROUP BY pid ORDER BY avg DESC";
  
    
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
// The exported functions, which can be accessed in index.js.
module.exports = {
  initDB,
  closeDB,
  login, 
  logout,
  totalRestart,
  storeCode,
  getAllPlaylists,
  getUserPlaylists,
  getPlaylist,
  getSong,
  getUser,
  getAverageFeatures,
  getRecsSimilarSongs,
  getRecsSimilarPlaylists,
  getRecsPopular,
  getTopSongsFrom,
  getMonthlyArtists,
  getStreakSids,
  getLongestStreak,
  getAcoustics,
  getPlaylistValidation,
  getPlaylistAcoustics,
  getPlaylistDance,
  getPlaylistEnergy
}