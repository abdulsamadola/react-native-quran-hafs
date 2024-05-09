import {useEffect} from 'react';
import {QuranPageLayout} from './src';
import {downloadFontsFiles} from './src/utils';

const App = () => {
  // useEffect(() => {
  //   downloadFontsFiles();
  // }, []);
  return (
    <QuranPageLayout
      chapterId={63}
      QURAN_FONTS_API="https://meccamuqra-public-mixed.b-cdn.net/meccamuqra/fonts/"
      showSlider
    />
  );
};

export default App;
