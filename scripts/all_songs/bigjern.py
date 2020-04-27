import os
import numpy as np
import pandas as pd
import requests

import csv

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

def main():

  outDF = pd.DataFrame(columns=['sid', 'title', 'artists', 'album', 'duration_ms', 'acousticness', 'danceability', 'energy', 'loudness', 'valence', 'tempo'])
  outDF = outDF.astype({'sid': str, 'title': str, 'artists': str, 'album': str, 'duration_ms': int, 'acousticness': float, 'danceability': float, 'energy': float, 'loudness': float, 'valence': float, 'tempo': float})
  uris = set()
 
  currDF = pd.read_csv('/Users/willmorgus/Desktop/550_proj/scripts/all_songs/SpotifyAudioFeatures.csv', usecols=['track_id'])
  currDF['track_id'].apply(lambda x: uris.add(x))
  currDF = pd.read_csv('/Users/willmorgus/Desktop/550_proj/scripts/new_playlists/millionplaylists.csv', usecols=['sid'])
  currDF['sid'].apply(lambda x: uris.add(x))
  with open("../top_songs/uris.txt") as file_in:
    for uri in file_in:
      uris.add(uri)
  print(len(uris))
  problems = []
  client_credentials_manager = SpotifyClientCredentials(client_id='66dd6c23e0cc482689cd472448f27a4c', client_secret='87d64cdd7a1f40ac935443e69711e2d7')
  sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
  currURIs = []
  ct = 0
  bad_count = 0
  for uri in uris: 
    ct += 1
    currURIs.append(uri.strip())
    toAdd = []
    if (len(currURIs) == 50):
      toAdd = []
      trax = sp.tracks(currURIs)
      ind = -1
      problems = []
      for tracks in trax:
        tracks = trax[tracks]
        for track in tracks:
          ind += 1
          if (track is not None):
            curr = {}
            curr['title'] = track['name']
            curr['album'] = track['album']['name']
            curr['sid'] = currURIs[ind]
            artists = ''
            for artist in track['artists']:
              artists = artists + artist['name'] + ', '
            curr['artists'] = artists.strip(', ')
            toAdd.append(curr)
            if (curr['artists'] == '' or curr['album'] == '' or curr['title'] == ''):
              problems.append(currURIs[ind])
          else:
            print(track)
            print(currURIs[ind])
            toAdd.append({'sid': currURIs[ind]})
            problems.append(currURIs[ind])
          
      analyses = sp.audio_features(currURIs)
      ind = -1
      for analysis in analyses:
        ind += 1
        if (analysis is not None and not currURIs[ind] in problems):
          curr = toAdd[ind]
          curr['duration_ms'] = analysis['duration_ms']
          curr['acousticness'] = analysis['acousticness']
          curr['danceability'] = analysis['danceability']
          curr['energy'] = analysis['energy']
          curr['loudness'] = analysis['loudness']
          curr['valence'] = analysis['valence']
          curr['tempo'] = analysis['tempo']
          toAdd[ind] = curr
          # print(curr)
          if (curr['sid'] == '' or curr['duration_ms'] == '' or curr['acousticness'] == '' or curr['danceability'] == '' or curr['energy'] == '' or curr['loudness'] == '' or curr['valence'] == '' or curr['tempo'] == ''):
            print(curr)
            problems.append(currURIs[ind])
        else:
          problems.append(currURIs[ind])
        
      for curr in toAdd:
        if curr['sid'] not in problems:
          outDF = outDF.append(curr, ignore_index=True)
        else:
          print('found problem with sid: ' + curr['sid'])
          print(curr)
      currURIs = []


  outDF.to_csv('allsongs.csv', index=False, encoding = 'utf-8')
  with open('problems.txt', 'w') as f:
    for uri in problems:
      f.write("%s\n" % uri)
    f.close()

main()