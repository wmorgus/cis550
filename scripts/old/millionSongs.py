import os
import h5py
import numpy as np
import pandas as pd





def main():
  dirName = '';
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