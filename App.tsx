import {QuranPageLayout} from './src';
const App = () => {
  return (
    <QuranPageLayout
      chapterId={65}
      QURAN_FONTS_API="https://meccamuqra-public-mixed.b-cdn.net/meccamuqra/fonts/"
      showSlider
      selectedBookedMarkedVerse={{
        chapter_id: 65,
        id: 5226,
        page_number: 559,
        text_uthmani:
          'فَذَاقَتْ وَبَالَ أَمْرِهَا وَكَانَ عَـٰقِبَةُ أَمْرِهَا خُسْرًا',
        verse_key: '65:9',
        verse_number: 9,
      }}
      onBookMarkedVerse={verse => {
        console.log(verse);
      }}
    />
  );
};

export default App;
