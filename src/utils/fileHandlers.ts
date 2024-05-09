import RNFS from 'react-native-fs';
import {QURAN_CHAPTERS_DIRECTORY} from '../common';

const downloadFontsFiles = () => {
  RNFS.downloadFile({
    fromUrl: 'https://websitetask123.000webhostapp.com/fontsFiles.zip',
    toFile: `${RNFS.DocumentDirectoryPath}/fonts`,
    background: true, // Enable downloading in the background (iOS only)
    discretionary: true, // Allow the OS to control the timing and speed (iOS only)
    progress: res => {
      // Handle download progress updates if needed
      const progress = (res.bytesWritten / res.contentLength) * 100;
    },
  })
    .promise.then(res => {
      console.log('res', JSON.stringify(res));
    })
    .catch(err => {
      console.log('Download error:', err);
    });
};

const isFileExists = (filePath: string) => {
  return RNFS.exists(filePath)
    .then(exists => exists)
    .catch(error => {
      console.log(error);
    });
};
const saveChapterAsJsonFile = (fileName: string, fileContent: string) => {
  RNFS.writeFile(`${QURAN_CHAPTERS_DIRECTORY}/${fileName}`, fileContent, 'utf8')
    .then(success => {
      console.log('FILE WRITTEN!');
    })
    .catch(err => {
      console.log(err.message);
    });
};
const readFromLocalStorageFile = (fileName: string) => {
  return RNFS.readFile(`${QURAN_CHAPTERS_DIRECTORY}/${fileName}`, 'utf8')
    .then(res => res)
    .catch(err => {
      console.log(err.message);
    });
};
const handleQuranChaptersDirectory = async () => {
  const isDirectoryExixts = await isFileExists(QURAN_CHAPTERS_DIRECTORY);
  if (!isDirectoryExixts)
    RNFS.mkdir(QURAN_CHAPTERS_DIRECTORY)
      .then(() => {
        console.log('Folder created successfully');
      })
      .catch(error => {
        console.error('Error creating folder:', error);
      });
};

export {
  downloadFontsFiles,
  isFileExists,
  saveChapterAsJsonFile,
  handleQuranChaptersDirectory,
  readFromLocalStorageFile,
};
