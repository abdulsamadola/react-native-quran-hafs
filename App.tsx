import {I18nManager} from 'react-native';
import {QuranPageLayout} from './src';
import {IMAGES} from './src/common';
const App = () => {
  I18nManager.forceRTL(true);
  I18nManager.allowRTL(true);
  return (
    <QuranPageLayout
      chapterId={60}
      QURAN_FONTS_API="https://meccamuqra-public-mixed.b-cdn.net/meccamuqra/fonts/"
      backgroundImage={IMAGES.mushafFrame}
      surahNameFrameImage={IMAGES.surahNameFrame}
      showChapterHeader
      onBookMarkedVerse={verse => {
        console.log(verse);
      }}
    />
  );
};

export default App;
