import os
import numpy as np
import pandas as pd
import requests

import csv

def main():
 
  problems = []
  with open("./all_songs/problems.txt") as file_in:
    for uri in file_in:
      problems.append(uri)
  print(len(problems))

  millionDF = pd.read_csv('/Users/willmorgus/Desktop/550_proj/scripts/new_playlists/millionplaylists.csv')
  print(millionDF.shape[0])
  print(millionDF[millionDF['sid'].isin(problems)].index)
  millionDF = millionDF.drop(millionDF[millionDF['sid'].isin(problems)].index)
  print(millionDF.shape[0])

  ownerDF = pd.DataFrame(columns=['pid', 'oid'])
  ownerDF['pid'] = millionDF['pid']
  ownerDF = ownerDF.drop_duplicates(['pid'])
  ownerDF['oid'] = ownerDF['oid'].apply(lambda x: 'million_playlist')
  print(ownerDF)

  topDF = pd.read_csv('/Users/willmorgus/Desktop/550_proj/scripts/top_songs/topsongs.csv')
  print(topDF.shape[0])
  print(topDF[topDF['sid'].isin(problems)].index)
  topDF = topDF.drop(topDF[topDF['sid'].isin(problems)].index)
  print(topDF.shape[0])



  millionDF.to_csv('new_millionplaylists.csv', index=False, encoding = 'utf-8')
  topDF.to_csv('new_topsongs.csv', index=False, encoding = 'utf-8')
  ownerDF.to_csv('million_owners.csv', index=False, encoding = 'utf-8')

main()