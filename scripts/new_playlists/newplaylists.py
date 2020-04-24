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
  allDF = pd.DataFrame(columns=['sid', 'pid'])

  for file1 in listOfFiles:
    if ('.csv' in file1):
      currDF = pd.read_csv(file1)
      currDF['sid'] = currDF['trackid'].apply(lambda x: x.split(':', )[2])
      currDF['pid'] = currDF['pid'].apply(lambda x: str(x) + 'milplay')
      allDF = allDF.append(currDF[['sid', 'pid']])
  allDF.to_csv('millionplaylists.csv', index=False)
  


      

main()