import {QuranPageLayout} from './src';
const App = () => {
  return (
    <QuranPageLayout
      chapterId={65}
      QURAN_FONTS_API="https://meccamuqra-public-mixed.b-cdn.net/meccamuqra/fonts/"
      showSlider
      // selectedBookedMarkedVerse={}
      onBookMarkedVerse={verse => {
        console.log(verse);
      }}
    />
  );
};

export default App;
