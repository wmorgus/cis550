import os
import h5py
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
  dirName = '/Users/willmorgus/Downloads/MillionSongSubset/data';
  listOfFiles = getListOfFiles(dirName)
  # print(listOfFiles)
  file1 = ''
  count = -1
  for file1 in listOfFiles:
    if ('.h5' in file1):
      if (count < 0):

        newFile = h5py.File(file1, "r+")
        for key in newFile.keys():
          # print("newkey")
          group = newFile[key]

          if ('artist_name' in group.keys()) :
            data = group['artist_name'].value
          
            print(data)
          # for key in group.keys():
          #   print(key)
        print("new file")
    count += 1

main()