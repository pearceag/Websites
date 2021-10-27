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

//Get song name  from the table playlst where the songs  are
app.get('/playlist/:songName', (request, response) => {
  const query = 'SELECT songName, artist, album, genre  FROM playlist';
  const params = [request.params.songName];
   connection.query(query, params, (error, rows) => {
    response.send({
      ok: true,
      playlist: rows.map(rowToPlaylist),
    })
  })
})

//Add a new song to playlist with the parameters found in the body of the request.
app.post('/playlist/', (request, response) => {
  const query = 'INSERT INTO playlist(songName, artist, album, genre) VALUES (?,?,?,?)';
  const params = [request.body.songName, request.body.artist, request.body.album, request.body.genre];
  connection.query(query, params, (error, result) => {
    response.send({
      okay: true,
    });
  });
});
