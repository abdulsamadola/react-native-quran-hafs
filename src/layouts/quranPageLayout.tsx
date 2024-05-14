import {useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {
  IAudioPlayerRef,
  IChapterVerses,
  IQuranPageLayout,
  ISurahVerse,
  IVersesBeforeAndAfterCurrentVerse,
} from '../types';
import {AudioPlayer, Loader, PageVersesList} from '../components';
import {useGetChapterByPage, useGetChapterLookup} from '../hooks';
import useGetReciters from '../hooks/apis/useGetReciters';

const QuranPageLayout = ({
  chapterId = 1,
  type = 'chapter',
  QURAN_FONTS_API,
  showSlider,
  selectedBookedMarkedVerse,
  onBookMarkedVerse,
  backgroundImage,
  surahNameFrameImage,
  showChapterHeader,
  resizeImageBackgroundMode,
  quranPageContainerStyle,
}: IQuranPageLayout) => {
  const flatlistRef = useRef<any>();
  const {chapterLookUp} = useGetChapterLookup({
    chapterId,
    type,
  });
  const {chapterVerses, isLoading} = useGetChapterByPage({
    chapterLookUp,
    chapterId,
    type,
    QURAN_FONTS_API: QURAN_FONTS_API,
  });
  const {allReciters} = useGetReciters({chapterId});
  const audioPlayerRef = useRef<IAudioPlayerRef>();
  const [selectedVerse, setSelectedVerse] = useState<ISurahVerse>(
    {} as ISurahVerse,
  );
  const [
    versesBeforeAndAfterCurrentVerse,
    setVersesBeforeAndAfterCurrentVerse,
  ] = useState<IVersesBeforeAndAfterCurrentVerse>(
    {} as IVersesBeforeAndAfterCurrentVerse,
  );
  const onContainerPress = () => {
    audioPlayerRef?.current?.setShowPlayerHandler(
      !audioPlayerRef?.current?.isPlayerShown(),
    );
  };
  const originalVerse = useMemo(
    () =>
      chapterVerses?.find(
        (item: IChapterVerses) =>
          item?.page_number == selectedVerse?.page_number,
      )?.originalVerses as ISurahVerse[],
    [selectedVerse],
  );

  useEffect(() => {
    TrackPlayer.setupPlayer();
  }, []);
  useEffect(() => {
    if (!isLoading && selectedBookedMarkedVerse) {
      setSelectedVerse(selectedBookedMarkedVerse);
      scrollToPageIndex();
    }
  }, [isLoading]);
  const scrollToPageIndex = () => {
    const selectedBookMarkedVerseIndex = chapterVerses?.findIndex(
      item => item?.page_number == selectedBookedMarkedVerse?.page_number,
    );
    setTimeout(() => {
      flatlistRef?.current?.scrollToIndex({
        index: selectedBookMarkedVerseIndex,
        animated: true,
      });
    }, 1000);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <Loader />
        ) : (
          <FlatList
            ref={flatlistRef}
            data={chapterVerses}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <PageVersesList
                showChapterHeader={showChapterHeader}
                pageVersesToDisplay={item?.verses}
                audioPlayerRef={audioPlayerRef}
                selectedVerse={selectedVerse}
                setSelectedVerse={setSelectedVerse}
                setVersesBeforeAndAfterCurrentVerse={
                  setVersesBeforeAndAfterCurrentVerse
                }
                onContainerPress={onContainerPress}
                chapterId={chapterId}
                showChapterName={index === 0}
                showBismllah={chapterId !== 9 && index === 0}
                pageNumber={item?.page_number}
                juzNumber={item?.juz_number}
                originalVerse={item?.originalVerses}
                onBookMarkedVerse={onBookMarkedVerse}
                backgroundImage={backgroundImage}
                surahNameFrameImage={surahNameFrameImage}
                resizeImageBackgroundMode={resizeImageBackgroundMode}
                quranPageContainerStyle={quranPageContainerStyle}
              />
            )}
            onScrollToIndexFailed={info => {
              // to handle if there is a failure when scrollToIndex
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                flatlistRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              });
            }}
          />
        )}
        <AudioPlayer
          ref={audioPlayerRef}
          chapterId={chapterId}
          setSelectedVerse={setSelectedVerse}
          selectedVerse={selectedVerse}
          allReciter={allReciters}
          versesBeforeAndAfterCurrentVerse={versesBeforeAndAfterCurrentVerse}
          setVersesBeforeAndAfterCurrentVerse={
            setVersesBeforeAndAfterCurrentVerse
          }
          originalVerse={originalVerse}
          showSlider={showSlider}
        />
      </View>
    </SafeAreaView>
  );
};

export default QuranPageLayout;
