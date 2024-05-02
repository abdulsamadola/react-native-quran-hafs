import {Dimensions} from 'react-native';
import {IReciter, ISelectedVerseLocation, ISurahVerse} from '../../@types';
import Clipboard from '@react-native-clipboard/clipboard';
import {useGetChapterAudio} from '../apis';

const OPTION_CONTAINER_WIDTH = 100;
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
  const {getVerseAudio} = useGetChapterAudio();

  const onPlayerPress = () => {
    getVerseAudio(
      selectedReciter?.id as number,
      selectedVerse?.verse_key,
      handlePlayPress,
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
            ? selectedVerseLocation?.itemLocationX
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
  };
};

export default useOptionsModalController;
