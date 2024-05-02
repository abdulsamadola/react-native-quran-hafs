import {ReactNode, useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {IAudioPlayerRef, IPageVersesListRef, ISurahVerse} from '../@types';
import {AudioPlayer, PageVersesList} from '../components';
import {useGetChapterByPage, useGetChapterLookup} from '../hooks';
import useGetReciters from '../hooks/apis/useGetReciters';
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
  const {chapterVerses, onEndReached} = useGetChapterByPage({
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
      <View style={{flex: 1}}>
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
            />
          )}
        />
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
