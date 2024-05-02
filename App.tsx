import {QuranPageLayout} from './react-native-quran-hafs';

const App = () => {
  return (
    <QuranPageLayout
      chapterId={2}
      QURAN_FONTS_API="https://qubaa-shared-public.b-cdn.net/qubaa/dev/quran-font/"
    />
  );
};

export default App;
