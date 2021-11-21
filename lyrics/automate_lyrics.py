import os
import json
import time
import spotipy
import lyricsgenius as lg

# Keys stored in this file
import config as key

# Hiding my API keys inside of config.py (not pushed to Github)
spot_id = key.SPOTIPY_CLIENT_ID
spot_secret = key.SPOTIPY_CLIENT_SECRET
spot_uri = key.SPOTIPY_REDIRECT_URI
genius_token = key.GENIUS_ACCESS_TOKEN

scope = 'user-read-currently-playing'

oauth_object = spotipy.SpotifyOAuth(client_id=spot_id,
                                    client_secret=spot_secret,
                                    redirect_uri=spot_uri,
                                    scope=scope)

# print(oauth_object)

token_dict = oauth_object.get_access_token()
token = token_dict['access_token']

# Spotify object
spotify_object = spotipy.Spotify(auth=token)

# Genius object
genius_object = lg.Genius(genius_token)

current_song = spotify_object.currently_playing()
# print(json.dumps(current_song, sort_keys=False, indent=4))


while True:
    current_song = spotify_object.currently_playing()
    status = current_song['currently_playing_type']

    if status == 'track':
        artist_name = current_song['item']['album']['artists'][0]['name']
        song_title = current_song['item']['name']
        
        length = current_song['item']['duration_ms']
        progress = current_song['progress_ms']
        time_left = int((length-progress)/1000) 

        song = genius_object.search_song(title=song_title, artist=artist_name)
        lyrics = song.lyrics
        print(lyrics)

        # Wait until new song
        time.sleep(time_left)

    elif status == 'ad':
        time.sleep(30)
