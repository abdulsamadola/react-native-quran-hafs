import {
  Dimensions,
  FlatList,
  GestureResponderEvent,
  I18nManager,
  PixelRatio,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ISelectedVerseLocation, ISurahVerse, IVerseWord} from '../../@types';
import {usePageFontFileController} from '../../hooks';
import {COLORS} from '../../common';
const {width} = Dimensions.get('screen');
interface IProps {
  item: ISurahVerse;
  isCentered: boolean;
  selectedVerse: ISurahVerse;
  seSelectedVerse: (value: ISurahVerse) => void;
  setSelectedVerseLocation: (value: ISelectedVerseLocation) => void;
}
const getFontSize = (size: number) => {
  // value to adjust
  const division = width / size;
  return width / division;
};
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
    <FlatList
      data={item?.words}
      horizontal
      scrollEnabled={false}
      keyExtractor={item => `${item?.id}`}
      contentContainerStyle={{
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        width: '100%',
        justifyContent: isCentered ? 'center' : 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
      }}
      renderItem={({item: innerItem}) => {
        // isVerseNumber: refers to ayah number form in mushaf
        const isVerseNumber = innerItem?.char_type_name == 'end';
        const isWordVerseSelected =
          innerItem?.verseData?.id == selectedVerse?.id && !isVerseNumber;

        return (
          <TouchableOpacity
            activeOpacity={1}
            onPress={event => {
              verseWordSelected(event, innerItem);
            }}>
            <Text
              adjustsFontSizeToFit
              style={{
                fontFamily: _fontFileFormatGenerator(innerItem?.page_number),
                fontSize: isCentered ? 35 : getFontSize(20),
                backgroundColor: isWordVerseSelected ? COLORS.light : 'white',
              }}>
              {innerItem?.code_v1}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default VerseLinesWordsList;
