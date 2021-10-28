const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const table = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(table);

app = express();

app.use(express.json());
connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

const port = 5001;
app.listen(port, () => {
  console.log("We're live on port 5001");
});

// Cross-orgin Resource Sharing
app.use((request, response, next) => {
  response.set('Access-Control-Allow-Origin', '*');
  next();
});

app.options('*', (request, response) => {
  response.set('Access-Control-Allow-Headers', 'Content-Type');
  response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  response.sendStatus(200);
});

function rowToPlaylist(row) {
  return {
    id: row.id,
    songName: row.songName,
    artist: row.artist,
    album: row.album,
    genre: row.genre,
    is_deleted: row.is_deleted,
  };
}

// Takes you to the report page
app.get('/report.html', (request, response) => {
  response.sendFile('/home/pearceag/cs347/project2/report.html');
});

// Selects all items in playlist
app.get('/playlist', (request, response) => {
  const query = 'SELECT * FROM playlist WHERE is_deleted = 0';
  connection.query(query, (error, rows) => {
    if (error) {
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

// Selects all the playlists items with the same artist
app.get('/playlist/artist/:artist', (request, response) => {
  const parameters = [
    request.params.artist,
  ];

  const query = 'SELECT * FROM playlist WHERE artist = ? AND is_deleted = 0';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const songs = rows.map(rowToPlaylist);
      response.json({
        ok: true,
        results: rows.map(rowToPlaylist),
      });
    }
  });
});

// Selects all the playlist items with the same genre
app.get('/playlist/genre/:genre', (request, response) => {
  const parameters = [
    request.params.genre,
  ];

  const query = 'SELECT * FROM playlist WHERE genre = ? AND is_deleted = 0';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const songs = rows.map(rowToPlaylist);
      response.json({
        ok: true,
        results: rows.map(rowToPlaylist),
      });
    }
  });
});

// Selects all the playlist items with the same album
app.get('/playlist/album/:album', (request, response) => {
  const parameters = [
    request.params.album,
  ];

  const query = 'SELECT * FROM playlist WHERE album = ? AND is_deleted = 0';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const songs = rows.map(rowToPlaylist);
      response.json({
        ok: true,
        results: rows.map(rowToPlaylist),
      });
    }
  });
});

// Select all the playlist items with the same song name
app.get('/playlist/songName/:songName', (request, response) => {
  const parameters = [
    request.params.songName,
  ];

  const query = 'SELECT * FROM playlist WHERE songName = ? AND is_deleted = 0';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const songs = rows.map(rowToPlaylist);
      response.json({
        ok: true,
        results: rows.map(rowToPlaylist),
      });
    }
  });
});


// Updates the playlist item indicated by the id param
app.patch('/playlist/:id', (request, response) => {
  const parameters = [
    request.body.songName,
    request.body.artist,
    request.body.album,
    request.body.genre,
    parseInt(request.params.id),
  ];

  const query = 'UPDATE playlist SET songName = ?, artist = ?, album = ?, genre = ? WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

// Deletes item in playlist at id
app.delete('/playlist/:id', (request, response) => {
  const parameters = [parseInt(request.params.id)];

  const query = 'UPDATE playlist SET is_deleted = 1 WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

//Inserts new item to playlist
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
