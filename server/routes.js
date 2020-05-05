var config = require('./db-config.js');
const request = require('request');
var oracle = require('oracledb');
const url = require('url');

var conn;
var app;

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
			if (response && response.body) {
				var res2 = JSON.parse(response.body);
				if (res2.access_token) {
					var token = res2.access_token;
					var expires = res2.expires_in;
					//here, set cookie for client with api token
          res.cookie('access_token', token, {maxAge: expires * 1000});
					res.redirect('http://ec2-54-89-146-102.compute-1.amazonaws.com:3000/')
				} else {
					console.log("error with accessing token")
					console.log(res2.error_description)
				}
			} else {
				console.log("error with refresh request")
			}});
  } else {
    var scopes = 'user-read-private user-read-email playlist-read-private user-library-read streaming';
    var redirect_uri = "http://ec2-54-89-146-102.compute-1.amazonaws.com:8081/storeCode"; //replace with address
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + encodeURIComponent(config.spotifyConfig.spotifyClientID) +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri));
  }
}

function storeCode(req, res) {
  if (req.query.code) {
		var redirect_uri = "http://ec2-54-89-146-102.compute-1.amazonaws.com:8081/storeCode";
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
					res.redirect('http://ec2-54-89-146-102.compute-1.amazonaws.com:3000/')
				} else {
					console.log("error with accessing token")
					console.log(res2.error_description)
				}
			} else {
				console.log("error with token request")
			}});
	} else {
		console.log(error)
		res.redirect('http://ec2-54-89-146-102.compute-1.amazonaws.com:3000/login')
	}
}

function totalRestart(req, res) {
  console.log(req.cookies)
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.clearCookie('expires')
  res.redirect('http://ec2-54-89-146-102.compute-1.amazonaws.com:3000/landing');
}

function logout(req, res) {
  res.clearCookie('access_token');
  res.redirect('http://ec2-54-89-146-102.compute-1.amazonaws.com:3000/landing')
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

async function recursiveReq(reqOps, addTo, cb) {
  request(reqOps, function (error, response){
    if (response && response.body) {
      var res2 = JSON.parse(response.body);
      if (res2) {
        // console.log(res2)
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

async function completeRecursion(app, apiKey, id, res, obj, output) {
  //call leems function here with id and output
  obj.allSongs = output
  res.send(obj)
  var sids = []
  var infoMap = new Map()
  var q = app.get('uploadQ')
  sids = output.map((val, ind) => {
    var currArtist = ''
    for (var ind in val.artists) {
      currArtist += val.artists[ind].name + ', '
    }
    currArtist = currArtist.substring(0, currArtist.lastIndexOf(','))
    
    infoMap.set(val.id, [val.name.split("'").join(""), val.album.name.split("'").join(""), currArtist.split("'").join("")])
    return(val.id)
  })
  // console.log(infoMap)
  
  q.push(id)
  app.set('uploadQ', q)
  //failsafe to make sure that failed uploads don't clog up the queue
  setTimeout(() => { 
    var q = app.get('uploadQ')
    q.splice(q.indexOf(id), 1)
    app.set('uploadQ', q)
  }, 90000)

  playlistValidation(sids, id, obj.owner.id, infoMap, apiKey, partial(completeValidation, app, id))
}

function completeValidation(app, id) {
  var q = app.get('uploadQ')
  q.splice(q.indexOf(id), 1)
  app.set('uploadQ', q)
  console.log(app.get('uploadQ'))
  var query = "COMMIT";
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    console.log('committing')
    console.log(result)
  });
}

function checkQueue(req, res, app) {
  // console.log(app)
  var q = app.get('uploadQ')
  if (q.indexOf(req.query.id) != -1) {
    res.json({status: 'uploading'})
  } else {
    res.json({status: 'done'})
  }
}

//thank god for the internet
function partial(f) {
  var args = Array.prototype.slice.call(arguments, 1)
  return function() {
    var remainingArgs = Array.prototype.slice.call(arguments)
    return f.apply(null, args.concat(remainingArgs))
  }
}

function getPlaylist(req, res, app) {//thanks, i hate it!
  var reqOps = {
    uri: 'https://api.spotify.com/v1/playlists/' + req.query.id,
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + req.query.apikey
    }
  }
  recursiveReq(reqOps, [], partial(completeRecursion, app, req.query.apikey, req.query.id, res)).then(() => {
    console.log('did that work?')
  })
}

function onlyAPlaylist(req, res) {
  var reqOps = {
    uri: 'https://api.spotify.com/v1/playlists/' + req.query.id,
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + req.query.apikey
    }
  }
  request(reqOps, function(error, response) {
    if (response && response.body) {
      var res2 = JSON.parse(response.body);
      if (res2) {
        res.send(res2)
      }
    } else {
      console.log(error)
    }
  })
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

  //req.params.pid
  query = "WITH PlaylistData AS (SELECT pid, sid FROM Playlist_Songs WHERE pid = '" + req.params.pid + "') " + 
  "SELECT AVG(energy) as energy, AVG(danceability) as danceability, AVG(loudness) as loudness, " +
  "AVG(acousticness) as acousticness, AVG(valence) as valence " +
  "FROM PlaylistData JOIN All_Songs ON PlaylistData.sid = All_Songs.sid " +
  "GROUP BY pid"
  

  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    console.log(result);
    res.send(JSON.stringify(result));
  });
};

function getTracklist(req, res) {
  console.log('finding tracks for ' + req.params.pid)
/*
  query = "SELECT sid FROM playlist_songs WHERE pid = '" + req.params.pid + "'"
  */
 query = "WITH ids AS (SELECT sid FROM playlist_songs WHERE pid = '" + req.params.pid + "')" + 
  "SELECT title, artists " + 
  "FROM all_songs NATURAL JOIN ids"
console.log(query)
  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    console.log(result);
    res.send(JSON.stringify(result));
  });
};

//use Spotify audio features to generate a new playlist
//by querying for songs with qualities similar to the selected user playlist
function getRecsSimilarSongs(req, res) {

  const queryObject = url.parse(req.url,true).query;
  console.log(queryObject)

  //build query
  var buildQuery = ""
  var upper; 
  if (queryObject.energy) {
    upper = parseFloat(queryObject.energy) + .1 
    buildQuery += " AND all_songs.energy BETWEEN " + (queryObject.energy - .1)  + " AND " + upper
  }
  if (queryObject.danceability) {
    upper = parseFloat(queryObject.danceability) + .1 
    buildQuery += " AND all_songs.danceability BETWEEN " + (queryObject.danceability - .1) + " AND " + upper
  }
  if (queryObject.loudness) {
    upper = parseFloat(queryObject.loudness) + .1 
    buildQuery += " AND all_songs.loudness BETWEEN " + (queryObject.loudness - .1) + " AND " + upper
  }
  if (queryObject.acoustiness) {
    upper = parseFloat(queryObject.acousticness) + .1 
    buildQuery += " AND all_songs.acoustiness BETWEEN " + (queryObject.acoustiness - .1) + " AND " + upper
  }
  if (queryObject.valence) {
    upper = parseFloat(queryObject.valence) + .1 
    buildQuery += " AND all_songs.valence BETWEEN " + (queryObject.valence - .1) + " AND " + upper
  }
  //console.log('buildquery ' + buildQuery)
  
  query = "WITH basis AS (SELECT sid FROM Playlist_Songs WHERE pid = '" + queryObject.pid + "') " + 
  "SELECT distinct title, artists " + 
  "FROM all_songs " + 
  "WHERE all_songs.sid NOT IN (SELECT * FROM basis) " + buildQuery
  + " AND ROWNUM < 101"
  
  console.log(query)
  
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
  query = `WITH PlaylistData AS 
  (SELECT pid, sid 
  FROM Playlist_Songs 
  WHERE pid = '` + req.params.pid + `'
  ), 
  temp2 as (
  SELECT pid, AVG(energy) as energy, AVG(danceability) as danceability, AVG(loudness) as loudness,
  AVG(acousticness) as acousticness, AVG(valence) as valence
  FROM PlaylistData
  JOIN all_Songs ON PlaylistData.sid = all_Songs.sid
  GROUP BY pid
  ),
  temp3 as (
  select pid, avg(energy) as energy, avg(danceability) as danceability, avg(loudness) as loudness
  from playlist_songs
  join all_songs on playlist_songs.sid = all_songs.sid
  group by pid
  )
  select distinct temp3.pid
  from temp3 
  join temp2 on temp2.pid <> temp3.pid
  where temp3.energy between temp2.energy - .1 AND temp2.energy + .1
  and temp3.danceability between temp2.danceability - .1 and temp2.danceability + .1
  and temp3.loudness between temp2.loudness - .1 and temp2.loudness +.1
  AND rownum < 101`;

  conn.execute(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    } 
    console.log(result);
    res.send(JSON.stringify(result));
  });
};

////use Spotify audio features to generate a new playlist
//by querying for top 100 songs with qualities similar to the selected user playlist
function getRecsPopular(req, res) {
  var testPID = '1055milplay'
  var song = "4CUCBqTA74rmKu4mEgD6QH"
  console.log('finding similar songs')
  console.log(req.url)
  const queryObject = url.parse(req.url,true).query;
  console.log(queryObject);


  //build query
  var buildQuery = ""
  var upper; 
  if (queryObject.energy) {
    upper = parseFloat(queryObject.energy) + .1 
    buildQuery += " AND all_songs.energy BETWEEN " + (queryObject.energy - .1)  + " AND " + upper
  }
  if (queryObject.danceability) {
    upper = parseFloat(queryObject.danceability) + .1 
    buildQuery += " AND all_songs.danceability BETWEEN " + (queryObject.danceability - .1) + " AND " + upper
  }
  if (queryObject.loudness) {
    upper = parseFloat(queryObject.loudness) + .1 
    buildQuery += " AND all_songs.loudness BETWEEN " + (queryObject.loudness - .1) + " AND " + upper
  }
  if (queryObject.acoustiness) {
    upper = parseFloat(queryObject.acousticness) + .1 
    buildQuery += " AND all_songs.acoustiness BETWEEN " + (queryObject.acoustiness - .1) + " AND " + upper
  }
  if (queryObject.valence) {
    upper = parseFloat(queryObject.valence) + .1 
    buildQuery += " AND all_songs.valence BETWEEN " + (queryObject.valence - .1) + " AND " + upper
  }
  //console.log('buildquery ' + buildQuery)
  
  query = "WITH basis AS (SELECT sid FROM Playlist_Songs WHERE pid = '" + testPID + "') " + 
  "SELECT distinct title, artists " + 
  "FROM all_songs " + 
  "WHERE all_songs.sid NOT IN (SELECT * FROM basis) " + 
  "AND all_songs.sid IN (SELECT sid FROM top_songs) " + buildQuery 
  + " AND ROWNUM < 101"
  
  console.log(query)
  
    conn.execute(query, function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      } 
      console.log(result);
      res.send(JSON.stringify(result));
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

function getAudioFeatures(sid, apiKey) { 
  var reqOps = {
    uri: 'https://api.spotify.com/v1/audio-features/' + sid,
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + apiKey
    }
  }
  return new Promise(function(resolve, reject){
    request(reqOps, function (error, response){
      if (response && response.body) {
        var res2 = JSON.parse(response.body);
        if (res2) {
          resolve(res2)
        } else {
          console.log("error with accessing song")
          reject(res2.error_description)
        }
      } else {
        console.log("error with song request")
        reject(error)
    }});
  });
}

function commit() {
  conn.execute("COMMIT", function(err, result) { //check if there is a playlist with this id 
    if (err) {
      console.log('commit failed:')
      console.error(err);
    }
  })
}

function execute(conn, query) { 
  // console.log('executing: ' + query)
  return new Promise(function(resolve, reject){
    conn.execute(query, function(err, result) {
      if (result) {
        if (result.rows) {
          console.log('result for: ' + query)
          console.log(result.rows)
          resolve(result.rows)
        } else {
          console.log('result for: ' + query)
          console.log(result)
          resolve(result)
        }
      } else {
        console.log("error with query: " + query)
        console.log(err)
        reject(err)
    }});
  });
}


function testPromiseAudioFeatures(req, res) {
  var prom = getAudioFeatures('1gmarFWgSwb4SWlmqDjWka', req.query.apikey)
  console.log('prom date')
  console.log(prom)
  prom.then((resObj) => {
    console.log('pinky promise')
    console.log(resObj)
  })
  res.send(200)
}

function queryTesterOut(req, res) {
  // deleteitall(conn, res)
  var q = 'SELECT COUNT(*) FROM all_songs'

  execute(conn, q).then((rows) => {
    // conn.execute("COMMIT", function(err, result) {
    //   if (err) {
    //     console.log('commit failed:')
    //     console.error(err);
    //   }
      res.send(rows)
    // })
    // return(rows)
  })
}

function deleteitall(conn, res) {
  var q = 'DELETE FROM playlist_songs'
  execute(conn, q).then(() => {
    q = 'DELETE FROM all_songs'
    execute(conn, q).then(() => {
      q = 'DELETE FROM playlist_owner'
      execute(conn, q).then(() => {
        q = 'COMMIT'
        execute(conn, q).then(() => {
          res.send('it is done.')
        })
      })
    })
  })
}

function newPlay(pid, oid, sids, infoMap, apiKey) {
  return new Promise((finalResolve, reject) => {
    query = "INSERT INTO playlist_owner(pid, oid) VALUES ('" + pid + "', '" + oid + "')";
    execute(conn, query).then((rows) => {
      Promise.all(sids.map((element) => {
        query = "SELECT COUNT(*) FROM All_Songs WHERE sid = '" + element + "'";
        return new Promise((insASRes, rej) => {
          execute(conn, query).then((rows) => {
            if (rows[0][0] == 0) {
              var sQuery = "INSERT INTO all_songs (sid, title, album, artists, energy, danceability, loudness, tempo, acousticness, duration_ms, valence) VALUES ("
              var valsToAdd = []
              var currVals = infoMap.get(element)
              //energy, danceability, loudness, tempo, acousticness, duration_ms, valence
              valsToAdd.push("'" + element + "'")
              valsToAdd.push("'" + currVals[0] + "'")
              valsToAdd.push("'" + currVals[1] + "'")
              valsToAdd.push("'" + currVals[2] + "'")
              getAudioFeatures(element, apiKey).then((featureObj) => {
                valsToAdd.push(featureObj.energy)
                valsToAdd.push(featureObj.danceability)
                valsToAdd.push(featureObj.loudness)
                valsToAdd.push(featureObj.tempo)
                valsToAdd.push(featureObj.acousticness)
                valsToAdd.push(featureObj.duration_ms)
                valsToAdd.push(featureObj.valence)
                for (ind in valsToAdd) {
                  if (ind != valsToAdd.length - 1){
                    sQuery += valsToAdd[ind] + ", "
                  } else {
                    sQuery += valsToAdd[ind] + ")"
                  }
                }
                execute(conn, sQuery).then((insertres) => {
                  insASRes()
                })
              })
            } else {
              insASRes()
            }
          })
        })
      })).then(() => {
        Promise.all(sids.map((element) => { 
          query = "INSERT INTO playlist_songs(pid, sid) VALUES ('" + pid + "', '" + element + "')";
          //insert every song into our new playlist
          return new Promise((insPSRes, rej) => {
            execute(conn, query).then(async (rows) => {
              insPSRes()
            })
          })
        })).then(() => {
          console.log('reached the end of case 1')
          finalResolve()
        })
      })
    });
  })
}

function notNewPlay(pid, sids, infoMap, apiKey) {
  return new Promise((finalResolve, reject) => {
    query = "SELECT * FROM Playlist_Songs WHERE pid = '" + pid + "'";
    execute(conn, query).then((rows) => {
      Promise.all(sids.map((element) => {
        return new Promise((checkPSRes, rej) => {
          var checkFlag = false
          for (var x in rows) {
            if (rows[x][1] == element) {
              checkFlag = true
            }
          }
          if (!checkFlag) {//new to playlist
            query = "SELECT COUNT(*) FROM All_Songs WHERE sid = '" + element + "'";
            execute(conn, query).then((rows) => {
              if (rows[0][0] == 0) {
                //new song is not in all_songs
                query = "INSERT INTO all_songs (sid, title, album, artists, energy, danceability, loudness, tempo, acousticness, duration_ms, valence) VALUES (" 
                var valsToAdd = []
                var currVals = infoMap.get(element)
                //energy, danceability, loudness, tempo, acousticness, duration_ms, valence
                valsToAdd.push("'" + element + "'")
                valsToAdd.push("'" + currVals[0] + "'")
                valsToAdd.push("'" + currVals[1] + "'")
                valsToAdd.push("'" + currVals[2] + "'")
                getAudioFeatures(element, apiKey).then((featureObj) => {
                  valsToAdd.push(featureObj.energy)
                  valsToAdd.push(featureObj.danceability)
                  valsToAdd.push(featureObj.loudness)
                  valsToAdd.push(featureObj.tempo)
                  valsToAdd.push(featureObj.acousticness)
                  valsToAdd.push(featureObj.duration_ms)
                  valsToAdd.push(featureObj.valence)
                  for (ind in valsToAdd) {
                    if (ind != valsToAdd.length - 1){
                      query += valsToAdd[ind] + ", "
                    } else {
                      query += valsToAdd[ind] + ")"
                    }
                  }
                  execute(conn, query).then((rows) => {
                    query = "INSERT INTO playlist_songs(pid, sid) " + 
                    "VALUES ('" + pid + "', '" + element + "')";
                    //insert every song into our new playlist
                    execute(conn, query).then((rows) => {
                      checkPSRes()
                    });
                  });
                })
              } else {
                query = "INSERT INTO playlist_songs(pid, sid) VALUES ('" + pid + "', '" + element + "')";
                //insert every song into our new playlist
                execute(conn, query).then((rows) => {
                  checkPSRes()
                });
              }
            });
          } else {
            checkPSRes()
          }
        })
      })).then(() => {
        var currplaysids = []
        for (var x in rows) {
          currplaysids.push(rows[x][1])
        }
        Promise.all(sids.map((element) => {
          return new Promise((checkDelRes, rej) => {
            if (!sids.includes(element)) {
              // if element not in sids, we must delete
              query = "DELETE playlist_songs WHERE sid = '" + element +  "' AND pid = '" + pid + "'";
              execute(conn, query).then((rows) => { 
                checkDelRes()
              });
            } else {
              checkDelRes()
            }
          })
        })).then(() => {
          console.log('reached the end of case 2')
          finalResolve()
        })
      })
      //print done here
    })
  })
}


async function playlistValidation(sids, pid, oid, infoMap, apiKey, cb) {
  console.log('time to validate:')
  query = "SELECT COUNT(*) FROM Playlist_Owner WHERE pid = '" + pid + "'";
  execute(conn, query).then((rows) => {
    if (rows[0][0] == 0) {
      newPlay(pid, oid, sids, infoMap, apiKey).then(() => {
        console.log('finished newplay')
        cb()
      })
    } else {
      notNewPlay(pid, sids, infoMap, apiKey).then(() =>{
        console.log('finished notnewplay')
        cb()
      })
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

function getDuration(req, res) {

  query = `WITH temp AS (SELECT sid FROM Playlist_Songs WHERE pid = '` + req.params.pid + `'),
  vals AS (SELECT SUM(duration_ms) / 1000 as duration, COUNT(*) AS count FROM temp 
      JOIN All_Songs ON temp.sid = all_songs.sid)
  SELECT count, FLOOR(duration / 3600) as hours, FLOOR(MOD(duration, 3600) / 60) as minutes, 
      CEIL(MOD(duration, 60)) as seconds, FLOOR(duration/count / 60) as avg_min,  CEIL(MOD(duration/count, 60)) as avg_sec
  FROM vals`;
  
    
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
  onlyAPlaylist,
  getUser,
  getAverageFeatures,
  getTracklist,
  checkQueue,
  getRecsSimilarSongs,
  getRecsSimilarPlaylists,
  getRecsPopular,
  getTopSongsFrom,
  getMonthlyArtists,
  getStreakSids,
  getLongestStreak,
  getAcoustics,
  getPlaylistAcoustics,
  getPlaylistDance,
  getPlaylistEnergy,
  testPromiseAudioFeatures,
  queryTesterOut,
  getDuration
}