import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  IModalRef,
  IPageVersesList,
  IQuranChapters,
  ISelectedVerseLocation,
} from '../../@types';
import {
  COLORS,
  FONT_FAMILY,
  IMAGES,
  QuranChapters,
  SURAH_WORD_AR,
  basmalah,
} from '../../common';
import {horizontalScale, hp, verticalScale} from '../../utils';
import handleVersesBeforeAndAfterCurrentVerse from '../../utils/handleBeforeAndAfterCurrentVerse';
import {OptionsModal} from '../modals';
import VerseLinesWordsList from './verseLinesWordsList';
const {width, height} = Dimensions.get('screen');

const PageVersesList = (props: IPageVersesList) => {
  const {
    verseToDisplay,
    audioPlayerRef,
    selectedVerse,
    setSelectedVerse,
    onContainerPress,
    chapterId,
    showChapterName,
    showBismllah,
    pageNumber,
    juzNumber,
    setVersesBeforeAndAfterCurrentVerse,
    originalVerse,
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
    handleVersesBeforeAndAfterCurrentVerse({
      selectedVerse,
      setVersesBeforeAndAfterCurrentVerse,
      originalVerse,
    });
  };
  const getChapterCodeV1 = (): number =>
    QuranChapters.find((item: IQuranChapters) => item?.id === chapterId)
      ?.code_v1 as number;
  const _renderSuranhNameAndBismillah = () => {
    return (
      <React.Fragment>
        {showChapterName && (
          <View style={styles.surahNameContainer}>
            <Image
              source={IMAGES.surahNameFrame}
              style={{width: '100%', height: 50}}
            />
            <View
              style={{
                position: 'absolute',
              }}>
              <Text style={{fontFamily: FONT_FAMILY.BISMLLAH, fontSize: 30}}>
                {String.fromCharCode(getChapterCodeV1())} {SURAH_WORD_AR}
              </Text>
            </View>
          </View>
        )}
        {showBismllah && (
          <View
            style={{
              width: '90%',
              alignItems: 'center',
              marginBottom: verticalScale(10),
            }}>
            <Text style={{fontFamily: FONT_FAMILY.BISMLLAH, fontSize: 25}}>
              {basmalah}
            </Text>
          </View>
        )}
      </React.Fragment>
    );
  };

  return (
    <View style={{height, width, backgroundColor: 'red'}}>
      <TouchableOpacity
        style={styles.containerBtn}
        activeOpacity={1}
        onPress={onContainerPress}>
        {_renderSuranhNameAndBismillah()}
        <FlatList
          data={verseToDisplay}
          scrollEnabled={false}
          // contentContainerStyle={{
          //   justifyContent: 'center',
          //   alignItems: 'center',
          // }}
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
            <Text style={styles.txt}>{pageNumber}</Text>
          </View>
        </View>
        <View style={styles.juzNumberContainer}>
          <View style={styles.juzNumberCircle}>
            <Text style={styles.txt}>الجزء {juzNumber}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Image style={styles.mushafFrameImage} source={IMAGES.mushafFrame} />
    </View>
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
    bottom: verticalScale(55),
    right: 0,
    width: '100%',
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahNameContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: hp('2%'),
  },
  juzNumberContainer: {
    position: 'absolute',
    width: '100%',
    top: hp(4.5),
    left: horizontalScale(5),
  },
  juzNumberCircle: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.light,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  txt: {fontFamily: FONT_FAMILY.CAIRO, fontSize: 15},
  containerBtn: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: hp('8%'),
  },
  mushafFrameImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: -2,
    alignSelf: 'center',
  },
});
