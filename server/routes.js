var config = require('./db-config.js');
var mysql = require('mysql');
const request = require('request');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


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

// The exported functions, which can be accessed in index.js.
module.exports = {
	getAllGenres: getAllGenres,
	getTopInGenre: getTopInGenre,
	getRecs: getRecs,
	getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade,
  posters: posters
}