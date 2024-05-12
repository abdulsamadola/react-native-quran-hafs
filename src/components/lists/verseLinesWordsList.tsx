import {
  Dimensions,
  GestureResponderEvent,
  I18nManager,
  PixelRatio,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {ISelectedVerseLocation, ISurahVerse, IVerseWord} from '../../@types';
import {COLORS} from '../../common';
import {usePageFontFileController} from '../../hooks';
interface IProps {
  item: ISurahVerse;
  isCentered: boolean;
  selectedVerse: ISurahVerse;
  seSelectedVerse: (value: ISurahVerse) => void;
  setSelectedVerseLocation: (value: ISelectedVerseLocation) => void;
}
const VerseLinesWordsList = ({
  item,
  isCentered,
  seSelectedVerse,
  selectedVerse,
  setSelectedVerseLocation,
}: IProps) => {
  const {_fontFileFormatGenerator} = usePageFontFileController();

  const verseWordSelected = (
    event: GestureResponderEvent,
    item: IVerseWord,
  ) => {
    const {pageY, pageX} = event.nativeEvent;
    seSelectedVerse(item?.verseData);
    setSelectedVerseLocation({
      itemLocationY: pageY,
      itemLocationX: pageX,
    });
  };
  return (
    <View
      style={{
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        justifyContent: isCentered ? 'center' : 'space-between',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
      }}>
      {item?.words?.map(innerItem => {
        // isVerseNumber: refers to ayah number form in mushaf
        const isVerseNumber = innerItem?.char_type_name == 'end';
        const isWordVerseSelected =
          innerItem?.verseData?.id == selectedVerse?.id && !isVerseNumber;

        return (
          <TouchableOpacity
            activeOpacity={1}
            key={`${innerItem?.id}`}
            onPress={event => {
              verseWordSelected(event, innerItem);
            }}>
            <Text
              adjustsFontSizeToFit
              style={{
                fontFamily: _fontFileFormatGenerator(innerItem?.page_number),
                fontSize: isCentered ? 35 : RFValue(18),
                backgroundColor: isWordVerseSelected
                  ? COLORS.light
                  : 'transparent',
              }}>
              {innerItem?.code_v1}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default VerseLinesWordsList;
