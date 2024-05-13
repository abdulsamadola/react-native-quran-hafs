import React, {useRef, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IModalRef, IPageVersesList, ISelectedVerseLocation} from '../../@types';
import {COLORS, FONT_FAMILY, IMAGES} from '../../common';
import {BismillahText, QuranPageHeader} from '../../layouts';
import {
  handleVersesBeforeAndAfterCurrentVerse,
  horizontalScale,
  hp,
  verticalScale,
} from '../../utils';
import {OptionsModal} from '../modals';
import VerseLinesWordsList from './verseLinesWordsList';
const {width, height} = Dimensions.get('screen');

const PageVersesList = (props: IPageVersesList) => {
  const {
    pageVersesToDisplay,
    audioPlayerRef,
    selectedVerse,
    setSelectedVerse,
    onContainerPress,
    showBismllah,
    pageNumber,
    juzNumber,
    setVersesBeforeAndAfterCurrentVerse,
    originalVerse,
    onBookMarkedVerse,
    backgroundImage,
    chapterId,
    showChapterHeader,
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
  const pageLinesCount = pageVersesToDisplay?.length;

  return (
    <View
      style={{
        height,
        width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
      }}>
      <ImageBackground
        source={backgroundImage}
        style={{height: '98%', width: '100%'}}>
        <TouchableOpacity
          style={styles.containerBtn}
          activeOpacity={1}
          onPress={onContainerPress}>
          {showChapterHeader && (
            <QuranPageHeader
              chapterId={chapterId}
              surahNameFrameImage={IMAGES.surahNameFrame}
            />
          )}
          {showBismllah && <BismillahText />}
          {pageVersesToDisplay?.map(item => (
            <View
              style={{flex: pageLinesCount && pageLinesCount >= 10 ? 1 : 0}}
              key={`${item?.lineNumber}`}>
              <VerseLinesWordsList
                key={`${item?.lineNumber}`}
                isCentered={item?.page_number === 1 || item?.page_number === 2}
                item={item as any}
                selectedVerse={selectedVerse}
                seSelectedVerse={setSelectedVerse}
                setSelectedVerseLocation={onVersePress}
              />
            </View>
          ))}
          <OptionsModal
            ref={optionsModalRef}
            selectedVerseLocation={selectedVerseLocation}
            selectedVerse={selectedVerse}
            seSelectedVerse={setSelectedVerse}
            handlePlayPress={handlePlayPress}
            selectedReciter={audioPlayerRef?.current?._renderSelelctedReciter()}
            onBookMarkedVerse={onBookMarkedVerse}
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
        {/* <Image style={styles.mushafFrameImage} source={IMAGES.mushafFrame} /> */}
      </ImageBackground>
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
    paddingBottom: hp('10%'),
  },
  mushafFrameImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: -2,
    alignSelf: 'center',
  },
});
