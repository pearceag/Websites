const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const table = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(table);

app = express();

app.use(express.json());
connection.connect();

const port = 5001;
app.listen(port, () => {
console.log("We're live on port 5001");
});

function rowToPlaylist(row) {
return {
  songName: row.songName,
  artist: row.artist,
  album: row.album,
  genre: row.genre,
};
}

//Get all info in playlist
app.get('/playlist', (request, response) => {
const query = 'SELECT * FROM playlist';
  connection.query(query, (error, rows) => {
    if(error) {
      response.status(500);
      response.json({
        ok: false,
        result: error.message,
      });
    } else {
      const playlist = rows.map(rowToPlaylist);
      response.json({
        ok: true,
        results: rows.map(rowToPlaylist),
      });
    }
  });
});

//Add a new song to playlist with the parameters found in the body of the request.
app.post('/playlist/', (request, response) => {
  if (request.body.hasOwnProperty('songName') &&
      request.body.hasOwnProperty('artist') &&
      request.body.hasOwnProperty('album') &&
      request.body.hasOwnProperty('genre')) {

    const params = [
      request.body.songName,
      request.body.artist,
      request.body.album,
      request.body.genre,
    ];

    const query = 'INSERT INTO playlist(songName, artist, album, genre) VALUES (?,?,?,?)';
    connection.query(query, params, (error, result) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
          results: result.insertId,
        });
      }
    });

  } else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete memory.',
    });
  }
});
