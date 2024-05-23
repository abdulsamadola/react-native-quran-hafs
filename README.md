# Package Title

react-native-quran-hafs

# Package description

It's a simple package allowing you to display the quran as mushaf

## Preinstallation

- Install this font family [QCF_BSML](https://github.com/quran/quran.com-images/blob/master/res/fonts/QCF_BSML.TTF) and change its extention to be .ttf not .TTF

- Upload the [fonts](https://github.com/quran/quran.com-images/tree/master/res/fonts) files as it is to you server so it can be easily downloaded

- The fonts url example [https://your-domain/fonts/]

## How to install and run

```bash
npm install react-native-quran-hafs
cd ios
pod install
cd ..
npm run ios
```

## Features

| Option              | Description                                           | Type                         | Required |
| ------------------- | ----------------------------------------------------- | ---------------------------- | -------- |
| chapterId           | The surah or juz id                                   | number                       | true     |
| type                | Its a type of what you want to display (surah or juz) | QuranTypesEnums              | true     |
| QURAN_FONTS_API     | Fonts url uploaded to your server                     | string                       | true     |
| backgroundImage     | The background of mushaf screen                       | ImageSourcePropType          | false    |
| surahNameFrameImage | The frame of surah name                               | ImageSourcePropType          | false    |
| onBookMarkedVerse   | Callback funtion tha return verse as ISurahVerse      | (verse: ISurahVerse) => void | false    |

## Usage Example

```bash
import {QuranPageLayout, QuranTypesEnums} from 'react-native-quran-hafs';
const App = () => {
  return (
    <QuranPageLayout
      chapterId={1}
      type={QuranTypesEnums.chapter} // QuranTypesEnums.juz
      QURAN_FONTS_API="https://your-domain/fonts/"
      onBookMarkedVerse={verse => console.log(verse)}
    />
  );
};
export default App;
```

![Screenshot](./test.jpg)
