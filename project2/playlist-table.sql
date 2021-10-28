DROP TABLE IF EXISTS playlist;

CREATE TABLE playlist(
  id SERIAL PRIMARY KEY,
  songName TEXT,
  artist TEXT,
  album TEXT,
  genre TEXT,
  is_deleted INT DEFAULT 0
);
