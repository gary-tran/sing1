import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import psycopg2
import time
from dotenv import load_dotenv
import os

load_dotenv()
dbuser = os.getenv('DB_USER')
dbpassword = os.getenv('DB_PASSWORD')
spotify_client_id = os.getenv('SPOTIFY_CLIENT_ID')
spotify_client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')

connection = psycopg2.connect(
    dbname="sing1",
    user=dbuser,
    password=dbpassword,
    host="localhost",
    port="5432"
)
cursor = connection.cursor()

client_credentials_manager = SpotifyClientCredentials(
    client_id=spotify_client_id,
    client_secret=spotify_client_secret
)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

print(spotify_client_secret)


def search_artists_by_genre(genre, limit=50, offset=0):
    try:
        query = f'genre:"{genre}"'
        results = sp.search(q=query, type='artist', limit=limit, offset=offset)
        return results['artists']['items']
    except spotipy.exceptions.SpotifyException as e:
        print(f"❌ API Error: {e}")
        time.sleep(5)
        return []


def get_all_artists_by_genre(genre, limit=50):
    artists = []
    offset = 0

    while True:
        results_batch = search_artists_by_genre(
            genre, limit=limit, offset=offset)
        if not results_batch:
            break
        artists.extend(results_batch)
        print(f"✅ Found batch of {len(results_batch)} (Total: {
              len(artists)}) artists for genre: {genre}")
        offset += limit
        time.sleep(1)

    save_artists(artists)
    return


def save_artists(artists):
    for artist in artists:
        cursor.execute("""
            SELECT 1 FROM artists WHERE spotify_id = %s;
        """, (artist['id'],))

        if cursor.fetchone() is None:
            cursor.execute("""
                INSERT INTO artists (spotify_id, name)
                VALUES (%s, %s)
                ON CONFLICT (spotify_id) DO NOTHING;
            """, (artist['id'], artist['name']))
            connection.commit()

            get_all_albums_tracks_by_artist(artist['id'])
        else:
            print(f"Artist {artist['name']} already exists in the database.")

    return


def get_all_album_ids_by_artist(artist_id, limit=50, offset=0):
    try:
        include_groups = 'album,single,compilation'
        results = sp.artist_albums(
            artist_id=artist_id, include_groups=include_groups, limit=limit, offset=offset)
        return results['items']
    except spotipy.exceptions.SpotifyException as e:
        print(f"❌ API Error: {e}")
        time.sleep(5)
        return []


def get_all_albums_tracks_by_artist(artist_id, limit=50):
    albums = []
    offset = 0

    while True:
        results_batch = get_all_album_ids_by_artist(
            artist_id=artist_id, limit=limit, offset=offset)
        if not results_batch:
            break
        albums.extend(results_batch)
        print(f"✅ Found batch of {len(results_batch)} (Total: {
              len(albums)}) albums for artist {artist_id}")
        offset += limit
        time.sleep(1)

    album_ids = []
    for album in albums:
        album_ids.append(album['id'])

    album_id_limit = 20
    album_id_offset = 0
    album_tracks = []
    while album_id_offset < len(album_ids):
        album_batch = album_ids[album_id_offset:(
            album_id_offset + album_id_limit)]

        try:
            results_batch = sp.albums(album_batch)
            album_tracks.extend(results_batch['albums'])
            time.sleep(1)
        except spotipy.exceptions.SpotifyException as e:
            print(f"❌ API Error: {e}")
            time.sleep(5)

        album_id_offset += album_id_limit
        save_albums_tracks(album_tracks)

    return


def save_albums_tracks(albums):
    for album in albums:
        album_name = album['name']
        release_date = album['release_date']
        image_url = album['images'][0]['url'] if album['images'] else None

        precision = album["release_date_precision"]

        if precision == "year":
            release_date = f"{release_date}-01-01"
        elif precision == "month":
            release_date = f"{release_date}-01"
        else:
            release_date = release_date

        for track in album['tracks']['items']:
            track_id = track['id']
            track_name = track['name']
            track_artist = track['artists'][0]['name']
            track_duration = track['duration_ms']

            cursor.execute("""
                INSERT INTO tracks (spotify_id, title, artist, album, image_url, duration_ms, release_date, release_date_precision)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (spotify_id) DO NOTHING;
            """, (track_id, track_name, track_artist, album_name, image_url, track_duration, release_date, precision))
            connection.commit()

    return


def update_tracks_list():
    cursor.execute("""
        SELECT spotify_id FROM artists;
    """)
    artist_rows = cursor.fetchall()
    artist_spotify_ids = [artist_row[0] for artist_row in artist_rows]

    for artist_spotify_id in artist_spotify_ids:
        get_all_albums_tracks_by_artist(artist_spotify_id)


if __name__ == "__main__":
    # NOTE: Add all songs and artists by various cantonese genres
    genre_list = ["cantopop", "hk-pop", "classic cantopop", "vintage cantonese pop", "hong kong tv drama",
                  "hong kong indie", "hong kong rock", "hong kong hip hop"]
    for genre in genre_list:
        get_all_artists_by_genre(genre)

    # NOTE: Add songs and artists by genre by changing 'genre'
    # genre = "classic cantopop"
    # get_all_artists_by_genre(genre)

    # NOTE: Add songs by artist by changing 'artist_spotify_id'
    # artist_spotify_id = "00SyEN54VSQ2GIYd7OZP8I"
    # save_artists([sp.artist(artist_id=artist_spotify_id)])

    # NOTE: Update tracks list from all artists in the database
    # update_tracks_list()

    cursor.close()
    connection.close()
