import {I18nManager} from 'react-native';
import {QuranPageLayout, QuranTypesEnums} from './src';
import {IMAGES} from './src/common';
const App = () => {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);

  return (
    <QuranPageLayout
      chapterId={2}
      type={QuranTypesEnums.chapter}
      QURAN_FONTS_API="https://meccamuqra-public-mixed.b-cdn.net/meccamuqra/fonts/"
      backgroundImage={IMAGES.mushafFrame}
      surahNameFrameImage={IMAGES.surahNameFrame}
      autoCompleteAudioAfterPlayingVerse
      onBookMarkedVerse={verse => {
        console.log(verse);
      }}
    />
  );
};

export default App;
