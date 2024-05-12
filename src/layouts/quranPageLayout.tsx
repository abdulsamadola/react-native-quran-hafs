import {ReactNode, useEffect, useRef, useState} from 'react';
import {Dimensions, FlatList, SafeAreaView, View} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {
  IAudioPlayerRef,
  IChapterVerses,
  ISurahVerse,
  IVersesBeforeAndAfterCurrentVerse,
} from '../@types';
import {AudioPlayer, Loader, PageVersesList} from '../components';
import {useGetChapterByPage, useGetChapterLookup} from '../hooks';
import useGetReciters from '../hooks/apis/useGetReciters';
interface IProps {
  chapterId: number;
  type?: 'chapter';
  chapterHeader?: ReactNode;
  QURAN_FONTS_API: string;
  showSlider?: boolean;
}
const {width} = Dimensions.get('screen');

const QuranPageLayout = ({
  chapterId = 1,
  type = 'chapter',
  chapterHeader,
  QURAN_FONTS_API,
  showSlider,
}: IProps) => {
  const {chapterLookUp} = useGetChapterLookup({
    chapterId,
    type,
  });
  const {chapterVerses, onEndReached, isLoading} = useGetChapterByPage({
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

  useEffect(() => {
    TrackPlayer.setupPlayer();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        {chapterHeader}
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <Loader />
        ) : (
          <FlatList
            data={chapterVerses}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            pagingEnabled
            horizontal
            onEndReached={onEndReached}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <PageVersesList
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
              />
            )}
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
          originalVerse={
            chapterVerses?.find(
              (item: IChapterVerses) =>
                item?.page_number === selectedVerse?.page_number,
            )?.originalVerses as ISurahVerse[]
          }
          showSlider={showSlider}
        />
      </View>
    </SafeAreaView>
  );
};

export default QuranPageLayout;
