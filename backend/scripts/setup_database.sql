CREATE DATABASE sing1;
\c sing1;

CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255) NOT NULL,
    image_url TEXT,
    duration_ms INTEGER NOT NULL,
    release_date DATE NOT NULL,
    release_date_precision VARCHAR(15) NOT NULL,
    popularity INTEGER,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('simple', title), 'A') || 
        setweight(to_tsvector('simple', artist), 'B') || 
        setweight(to_tsvector('simple', album), 'C')
    ) STORED
);

CREATE TABLE lyrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID UNIQUE NOT NULL,
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    synced_lyrics TEXT,
    plain_lyrics_simplified TEXT,
    plain_lyrics_traditional TEXT,
    is_instrumental BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_track FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
);

CREATE TABLE romanizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lyrics_id UUID NOT NULL,
    system_name VARCHAR(255) NOT NULL,
    romanized_lyrics TEXT NOT NULL,
    CONSTRAINT fk_lyrics FOREIGN KEY (lyrics_id) REFERENCES lyrics(id) ON DELETE CASCADE,
    UNIQUE (lyrics_id, system_name)
);