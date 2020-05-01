import os
import numpy as np
import pandas as pd

def getListOfFiles(dirName):
  # create a list of file and sub directories 
  # names in the given directory 
  listOfFile = os.listdir(dirName)
  allFiles = list()
  # Iterate over all the entries
  for entry in listOfFile:
    # Create full path
    fullPath = os.path.join(dirName, entry)
    # If entry is a directory then get the list of files in this directory 
    if os.path.isdir(fullPath):
      allFiles = allFiles + getListOfFiles(fullPath)
    else:
      allFiles.append(fullPath)
  return allFiles


def main():
  dirName = '/Users/willmorgus/Desktop/550_proj/scripts/new_playlists'
  listOfFiles = getListOfFiles(dirName)
  file1 = ''
  allDF = pd.DataFrame(columns=['pid', 'sid'])

  for file1 in listOfFiles:
    print(file1)
    if ('-' in file1):
      currDF = pd.read_csv(file1)
      currDF['pid'] = currDF['pid'].apply(lambda x: str(x) + 'milplay')
      currDF['sid'] = currDF['trackid'].apply(lambda x: x.split(':', )[2])
      print(currDF)
      print(allDF)
      allDF = allDF.append(currDF[['pid', 'sid']])
      print(allDF)
  allDF.to_csv('millionplaylists.csv', index=False)
  

  #create CSV of millionplaylist jerns with uid = 'x'


      

main()

def alt():
  outDF = pd.DataFrame(columns=['uid', 'pid'])
  for i in range(0, 4000):
    curr_play = str(i) + 'milplay'
    temp = {'uid': 'MillionPlaylists', 'pid': curr_play}
    outDF = outDF.append(temp, ignore_index=True)
  outDF.to_csv('playlistowners.csv', index=False)


# alt()