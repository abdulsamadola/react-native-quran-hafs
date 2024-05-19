import {QuranPageLayout, QuranTypesEnums} from './src';
import {IMAGES} from './src/common';
const App = () => {
  return (
    <QuranPageLayout
      chapterId={10}
      type={QuranTypesEnums.juz}
      QURAN_FONTS_API="https://meccamuqra-public-mixed.b-cdn.net/meccamuqra/fonts/"
      backgroundImage={IMAGES.mushafFrame}
      surahNameFrameImage={IMAGES.surahNameFrame}
      showChapterHeader
      autoCompleteAudioAfterPlayingVerse
      onBookMarkedVerse={verse => {
        console.log(verse);
      }}
    />
  );
};

export default App;
