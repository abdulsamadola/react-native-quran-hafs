import Clipboard from '@react-native-clipboard/clipboard';
import {Dimensions, I18nManager} from 'react-native';
import {IReciter, ISelectedVerseLocation, ISurahVerse} from '../../types';
import {useGetChapterAudio} from '../apis';

const OPTION_CONTAINER_WIDTH = 130;
const OPTION_CONTAINER_HEIGHT = 50;
const {width} = Dimensions.get('screen');
interface IProps {
  selectedVerseLocation: ISelectedVerseLocation | undefined;
  selectedVerse: ISurahVerse;
  selectedReciter: IReciter | undefined;
  handlePlayPress: () => void;
  setIsVisible: (value: boolean) => void;
  seSelectedVerse: (value: ISurahVerse) => void;
}
const useOptionsModalController = ({
  selectedVerseLocation,
  selectedVerse,
  selectedReciter,
  handlePlayPress,
  setIsVisible,
  seSelectedVerse,
}: IProps) => {
  const {getVerseAudio, isVersePositionLoading} = useGetChapterAudio();

  const onPlayerPress = ({
    reciterId,
    handlePlayPress,
    verse_key,
    isBeforeOrAfterVerse,
  }: {
    reciterId: number;
    verse_key: string;
    handlePlayPress?: () => void;
    isBeforeOrAfterVerse?: boolean;
  }) => {
    getVerseAudio(
      reciterId as number,
      verse_key,
      handlePlayPress,
      isBeforeOrAfterVerse,
    );
  };
  const copyVerseToClipBoard = () => {
    Clipboard?.setString(selectedVerse?.text_uthmani);
    console.log('copied');
  };
  const _renderOptionContainerPosition = ():
    | {
        translateY: number;
        translateX: number;
      }
    | undefined => {
    if (selectedVerseLocation)
      return {
        translateX:
          selectedVerseLocation?.itemLocationX + OPTION_CONTAINER_WIDTH < width
            ? I18nManager.isRTL
              ? -selectedVerseLocation?.itemLocationX
              : selectedVerseLocation?.itemLocationX
            : I18nManager.isRTL
            ? -(selectedVerseLocation?.itemLocationX - 100)
            : selectedVerseLocation?.itemLocationX - 100,
        translateY:
          selectedVerseLocation?.itemLocationY + OPTION_CONTAINER_HEIGHT < width
            ? selectedVerseLocation?.itemLocationY
            : selectedVerseLocation?.itemLocationY - 100,
      };
  };
  const onRequestClose = () => {
    setIsVisible(false);
    seSelectedVerse({} as ISurahVerse);
  };
  return {
    _renderOptionContainerPosition,
    OPTION_CONTAINER_WIDTH,
    copyVerseToClipBoard,
    onPlayerPress,
    onRequestClose,
    isVersePositionLoading,
  };
};

export default useOptionsModalController;
