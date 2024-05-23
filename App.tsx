import {QuranPageLayout, QuranTypesEnums} from './src';
import {IMAGES} from './src/common';
const App = () => {
  return (
    <QuranPageLayout
      chapterId={80}
      type={QuranTypesEnums.chapter}
      QURAN_FONTS_API="https://meccamuqra-public-mixed.b-cdn.net/meccamuqra/fonts/"
      backgroundImage={IMAGES.mushafFrame}
      surahNameFrameImage={IMAGES.surahNameFrame}
      onBookMarkedVerse={verse => {}}
    />
  );
};

export default App;
