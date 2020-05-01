import os
import numpy as np
import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

client_credentials_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

def main():
  outDF = pd.DataFrame(columns=['sid', 'day', 'month', 'year', 'streams'])
  countDict = {}
  url_uriDict = {}
  uris = set()
  currDF = pd.read_csv('/Users/willmorgus/Desktop/550_proj/scripts/top_songs/global.csv')
  for index, row in currDF.iterrows():
    sid = row['url'].split('/')[4]
    if (sid not in url_uriDict):
      uris.add(sid)
    else:
      sid = url_uriDict[sid]
    outDF = outDF.append({'sid': sid, 'day': row['day'], 'month': row['month'], 'year': row['year'], 'streams': row['streams']}, ignore_index=True)
    
  outDF.to_csv('topsongs.csv', index=False)
  with open('uris.txt', 'w') as f:
    for uri in uris:
      f.write("%s\n" % uri)
    f.close()




  # print(r.history)
  # <meta property="og:url" content="https://open.spotify.com/track/5aAx2yezTd8zXrkmtKl66Z" />

  # allDF = allDF.append(currDF[['sid', 'pid']])

  # allDF.to_csv('millionplaylists.csv', index=False)
  


      

main()