import React, {MutableRefObject, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  PixelRatio,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  IAudioPlayerRef,
  ILineNumber,
  IModalRef,
  ISelectedVerseLocation,
  ISurahVerse,
} from '../../@types';
import {OptionsModal} from '../modals';
import VerseLinesWordsList from './verseLinesWordsList';
interface IProps {
  setSelectedVerse: (value: ISurahVerse) => void;
  selectedVerse: ISurahVerse;
  verseToDisplay: ILineNumber[] | undefined;
  audioPlayerRef: MutableRefObject<IAudioPlayerRef | undefined>;
  onContainerPress: () => void;
}
const {width, height} = Dimensions.get('screen');

const PageVersesList = (props: IProps) => {
  const {
    verseToDisplay,
    audioPlayerRef,
    selectedVerse,
    setSelectedVerse,
    onContainerPress,
  } = props;
  const optionsModalRef = useRef<IModalRef>();
  const [selectedVerseLocation, setSelectedVerseLocation] =
    useState<ISelectedVerseLocation>();

  const onVersePress = (location: ISelectedVerseLocation) => {
    optionsModalRef?.current?.openModal();
    setSelectedVerseLocation(location);
  };
  const closeOptionsModal = () => {
    optionsModalRef?.current?.closeModal();
  };
  const handlePlayPress = () => {
    closeOptionsModal();
    audioPlayerRef?.current?.setShowPlayerHandler(true);
  };
  const pageNumber = verseToDisplay && verseToDisplay[0]?.page_number;
  return (
    <TouchableOpacity
      style={{flex: 1}}
      activeOpacity={1}
      onPress={onContainerPress}>
      <FlatList
        data={verseToDisplay}
        style={{
          flexGrow: 0,
        }}
        contentContainerStyle={{
          paddingBottom: PixelRatio?.getPixelSizeForLayoutSize(50),
          width,
          justifyContent: 'center',
          marginTop:
            pageNumber == 2 || pageNumber == 1
              ? PixelRatio?.getPixelSizeForLayoutSize(50)
              : 0,
        }}
        pagingEnabled
        onEndReachedThreshold={1}
        keyExtractor={item => `${item?.lineNumber}`}
        renderItem={({item}) => (
          <VerseLinesWordsList
            isCentered={item?.page_number === 1 || item?.page_number === 2}
            item={item as any}
            selectedVerse={selectedVerse}
            seSelectedVerse={setSelectedVerse}
            setSelectedVerseLocation={onVersePress}
          />
        )}
      />
      <OptionsModal
        ref={optionsModalRef}
        selectedVerseLocation={selectedVerseLocation}
        selectedVerse={selectedVerse}
        seSelectedVerse={setSelectedVerse}
        handlePlayPress={handlePlayPress}
        selectedReciter={audioPlayerRef?.current?._renderSelelctedReciter()}
      />
    </TouchableOpacity>
  );
};
export default PageVersesList;
