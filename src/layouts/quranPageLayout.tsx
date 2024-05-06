import {ReactNode, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, View} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {IAudioPlayerRef, IPageVersesListRef, ISurahVerse} from '../@types';
import {AudioPlayer, Loader, PageVersesList} from '../components';
import {useGetChapterByPage, useGetChapterLookup} from '../hooks';
import useGetReciters from '../hooks/apis/useGetReciters';
import {COLORS} from '../common';
interface IProps {
  chapterId: number;
  type?: 'chapter';
  chapterHeader?: ReactNode;
  QURAN_FONTS_API: string;
}

const QuranPageLayout = ({
  chapterId = 1,
  type = 'chapter',
  chapterHeader,
  QURAN_FONTS_API,
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
              flexGrow: 0,
            }}
            pagingEnabled
            horizontal
            onEndReached={onEndReached}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <PageVersesList
                verseToDisplay={item?.verses}
                audioPlayerRef={audioPlayerRef}
                selectedVerse={selectedVerse}
                setSelectedVerse={setSelectedVerse}
                onContainerPress={onContainerPress}
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
        />
      </View>
    </SafeAreaView>
  );
};

export default QuranPageLayout;
