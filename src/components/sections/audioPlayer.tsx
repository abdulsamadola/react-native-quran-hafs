import Slider from '@react-native-community/slider';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import {COLORS, IMAGES} from '../../common';
import {useAudioPlayerController} from '../../hooks';
import AudioPlayerControls from './audioPlayerControls';
import {IModalRef, IReciter, ISurahVerse} from '../../@types';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {RecitersModal} from '../modals';
interface IProps {
  allReciter: IReciter[];
  setSelectedVerse: (verse: ISurahVerse) => void;
  chapterId: number;
  selectedVerse: ISurahVerse;
}
const AudioPlayer = (props: IProps, ref: any) => {
  const {allReciter, setSelectedVerse, chapterId, selectedVerse} = props;
  const [selectedReciter, setSelectedReciter] = useState<IReciter>();
  const {duration, position} = useProgress();
  const {
    changeHandler,
    renderplayPauseBtn,
    onPlayPause,
    openReciterModal,
    recitersModalRef,
    formatTime,
  } = useAudioPlayerController();
  const [showPlayer, setShowPlayer] = useState(false);
  useImperativeHandle(ref, () => ({
    async setShowPlayerHandler(value: boolean) {
      // if (value === false) await TrackPlayer?.reset();
      setShowPlayer(value);
    },
    isPlayerShown() {
      return showPlayer;
    },
    _renderSelelctedReciter() {
      return selectedReciter;
    },
  }));
  useEffect(() => {
    if (allReciter?.length > 0) setSelectedReciter(allReciter[0]);
  }, [allReciter]);
  const closeAudioPlayer = async () => {
    await TrackPlayer.pause();
    setSelectedVerse({} as ISurahVerse);
    setShowPlayer(false);
  };
  return (
    showPlayer && (
      <View style={styles.container}>
        <View style={styles.closeContainer}>
          <TouchableOpacity onPress={closeAudioPlayer}>
            <Image source={IMAGES.close} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <Slider
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor={COLORS.darkBlack}
          maximumTrackTintColor={COLORS.light}
          thumbTintColor={COLORS.lighBlack}
          onSlidingComplete={changeHandler}
        />
        <View style={styles.row}>
          <View style={{flex: 2}}>
            <Text>
              {formatTime(position)} / {formatTime(duration)}
            </Text>
          </View>
          <View style={styles.controlersContainer}>
            <AudioPlayerControls
              onPlayPause={onPlayPause}
              renderplayPauseBtn={renderplayPauseBtn}
            />
          </View>

          <TouchableOpacity
            onPress={openReciterModal}
            style={styles.recitersBtn}>
            <Text numberOfLines={2}>{selectedReciter?.name}</Text>
            <Image source={IMAGES.arrowDown} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <RecitersModal
          ref={recitersModalRef}
          allReciter={allReciter}
          selectedReciter={selectedReciter}
          setSelectedReciter={setSelectedReciter}
          chapterId={chapterId}
          selectedVerse={selectedVerse}
        />
      </View>
    )
  );
};

export default forwardRef(AudioPlayer);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  controlersContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  closeIcon: {width: 25, height: 25},
  recitersBtn: {
    flex: 2,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
