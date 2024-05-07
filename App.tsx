import {QuranPageLayout} from './src';

const App = () => {
  return (
    <QuranPageLayout
      chapterId={17}
      QURAN_FONTS_API="https://qubaa-shared-public.b-cdn.net/qubaa/dev/quran-font/"
    />
  );
};

export default App;
