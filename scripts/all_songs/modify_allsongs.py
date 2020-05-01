import os
import numpy as np
import pandas as pd
import requests

import csv

def checkFunc(x):
    if ('e' in str(x)):
      # print(type(x))
      # print(x)
      return 0
    else:
      return x

def ugh(x):
  # print(x)
  after_x = x.replace('.*e-.*', 0, regex=True)
  # print(after_x)
  return x.replace('.*e-.*', 0, regex=True)

def main():
  pd.options.display.float_format = '{:.5f}'.format
  currDF = pd.read_csv('/Users/willmorgus/Desktop/550_proj/scripts/all_songs/allsongs.csv')
  
  # print(currDF)
  currDF[['acousticness', 'danceability', 'energy', 'loudness', 'valence', 'tempo']] = currDF[['acousticness', 'danceability', 'energy', 'loudness', 'valence', 'tempo']].apply(lambda x: x.round(5))
  currDF = currDF.drop_duplicates(['sid'])
  print(currDF.sid.nunique())
  currDF.to_csv('new_allsongs.csv', index=False, encoding = 'utf-8')


main()