import {QuranPageLayout} from './src';
import {IMAGES} from './src/common';
const App = () => {
  return (
    <QuranPageLayout
      chapterId={65}
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
