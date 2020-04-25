import os
import numpy as np
import pandas as pd
import requests

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
    keyStr = sid + '/' + str(row['day']) +'/'+ str(row['month']) + '/' + str(row['year'])
    if keyStr in countDict:
      countDict[keyStr] = countDict[keyStr] + row['streams']
    else:
      countDict[keyStr] = row['streams']

  uris = []
  #get track_id from lynne's

  with open("uris.txt") as file_in:
    
    for uri in file_in:
        uris.append(uri)

  for uri in uris:
    


  outDF.to_csv('allsongs.csv', index=False)
  # print(r.history)
  # <meta property="og:url" content="https://open.spotify.com/track/5aAx2yezTd8zXrkmtKl66Z" />

  # allDF = allDF.append(currDF[['sid', 'pid']])

  # allDF.to_csv('millionplaylists.csv', index=False)
  


      

main()