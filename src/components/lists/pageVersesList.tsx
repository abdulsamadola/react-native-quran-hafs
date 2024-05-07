import React, {MutableRefObject, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  PixelRatio,
  StyleSheet,
  Text,
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
import {COLORS, IMAGES} from '../../common';
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
  const [viewLayout, setViewLayout] = useState<{
    height: number;
    width: number;
  }>();

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
    <ImageBackground source={IMAGES.mushafFrame} style={{height, width}}>
      <TouchableOpacity
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          paddingTop: height / 12,
        }}
        activeOpacity={1}
        onPress={onContainerPress}
        onLayout={event => {
          if (event?.nativeEvent.layout)
            setViewLayout(event?.nativeEvent.layout);
        }}>
        <FlatList
          data={verseToDisplay}
          scrollEnabled={false}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
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
        <View style={styles.pageNumberContainer}>
          <View style={styles.pageNumberView}>
            <Text>{pageNumber}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
};
export default PageVersesList;

const styles = StyleSheet.create({
  pageNumberView: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumberContainer: {
    position: 'absolute',
    bottom: height * 0.07,
    right: 0,
    width: '100%',
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
