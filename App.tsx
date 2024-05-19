import {QuranPageLayout, QuranTypesEnums} from './src';
import {IMAGES} from './src/common';
const App = () => {
  return (
    <QuranPageLayout
      chapterId={79}
      type={QuranTypesEnums.chapter}
      QURAN_FONTS_API="https://qubaa-shared-public.b-cdn.net/qubaa/dev/quran-font/"
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
