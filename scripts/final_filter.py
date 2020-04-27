import os
import numpy as np
import pandas as pd
import requests

import csv

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

def main():
 
  # removing problems
  problems = []
  with open("./all_songs/problems.txt") as file_in:
    for uri in file_in:
      problems.append(uri.strip())

  millionDF = pd.read_csv('/Users/willmorgus/Desktop/550_proj/scripts/new_playlists/millionplaylists.csv')
  millionDF = millionDF.drop(millionDF[millionDF['sid'].isin(problems)].index)

  topDF = pd.read_csv('/Users/willmorgus/Desktop/550_proj/scripts/top_songs/topsongs.csv')
  topDF = topDF.drop(topDF[topDF['sid'].isin(problems)].index)

  # panda panda panda panda panda panda panda
  millionDF = millionDF.drop_duplicates(['pid', 'sid'])

  # adding owners to million
  ownerDF = pd.DataFrame(columns=['pid', 'oid'])
  ownerDF['pid'] = millionDF['pid']
  ownerDF = ownerDF.drop_duplicates(['pid'])
  ownerDF['oid'] = ownerDF['oid'].apply(lambda x: 'million_playlist')

  # don't ask about this one
  jankDF = pd.DataFrame(columns=['sid', 'title', 'artists', 'album', 'duration_ms', 'acousticness', 'danceability', 'energy', 'loudness', 'valence', 'tempo'])
  jankDF = jankDF.astype({'sid': str, 'title': str, 'artists': str, 'album': str, 'duration_ms': int, 'acousticness': float, 'danceability': float, 'energy': float, 'loudness': float, 'valence': float, 'tempo': float})

  client_credentials_manager = SpotifyClientCredentials(client_id='66dd6c23e0cc482689cd472448f27a4c', client_secret='87d64cdd7a1f40ac935443e69711e2d7')
  sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

  ihatethis = ['3omXshBamrREltcf24gYDC', '2kQ4zlRlNatwhsNsJYCC99']
  toAdd = []
  trax = sp.tracks(ihatethis)
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
        curr['sid'] = ihatethis[ind]
        artists = ''
        for artist in track['artists']:
          artists = artists + artist['name'] + ', '
        curr['artists'] = artists.strip(', ')
        toAdd.append(curr)
        if (curr['artists'] == '' or curr['album'] == '' or curr['title'] == ''):
          problems.append(ihatethis[ind])
      else:
        print(track)
        print(ihatethis[ind])
        toAdd.append({'sid': ihatethis[ind]})
        problems.append(ihatethis[ind])
      
  analyses = sp.audio_features(ihatethis)
  ind = -1
  for analysis in analyses:
    ind += 1
    if (analysis is not None and not ihatethis[ind] in problems):
      curr = toAdd[ind]
      curr['duration_ms'] = analysis['duration_ms']
      curr['acousticness'] = analysis['acousticness']
      curr['danceability'] = analysis['danceability']
      curr['energy'] = analysis['energy']
      curr['loudness'] = analysis['loudness']
      curr['valence'] = analysis['valence']
      curr['tempo'] = analysis['tempo']
      toAdd[ind] = curr
      if (curr['sid'] == '' or curr['duration_ms'] == '' or curr['acousticness'] == '' or curr['danceability'] == '' or curr['energy'] == '' or curr['loudness'] == '' or curr['valence'] == '' or curr['tempo'] == ''):
        print(curr)
        problems.append(ihatethis[ind])
    else:
      problems.append(ihatethis[ind])
    
  for curr in toAdd:
    if curr['sid'] not in problems:
      jankDF = jankDF.append(curr, ignore_index=True)
    else:
      print('found problem with sid: ' + curr['sid'])
      print(curr)

  print('bad: ')
  print(problems)
  print('not bad:')
  print(jankDF['sid'].to_list())
  print(ihatethis)

  #write
  millionDF.to_csv('new_new_millionplaylists.csv', index=False, encoding = 'utf-8')
  topDF.to_csv('new_topsongs.csv', index=False, encoding = 'utf-8')
  ownerDF.to_csv('million_owners.csv', index=False, encoding = 'utf-8')
  jankDF.to_csv('sigh.csv', index=False, encoding='utf-8')

main()