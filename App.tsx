import {QuranPageLayout} from './src';

const App = () => {
  return (
    <QuranPageLayout
      chapterId={39}
      QURAN_FONTS_API="https://meccamuqra-public-mixed.b-cdn.net/meccamuqra/fonts/"
    />
  );
};

export default App;
