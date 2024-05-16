import {ActivityIndicator, I18nManager, Text, View} from 'react-native';
import {COLORS} from '../../common';

const Loader = ({
  chapterProgress,
  showTxt,
}: {
  chapterProgress: number;
  showTxt: boolean;
}) => {
  const txt =
    chapterProgress < 100
      ? I18nManager.isRTL
        ? 'جاري تحميل ملقات السورة'
        : 'Downloading the chapter files'
      : I18nManager.isRTL
      ? 'جاري تحميل خطوط السورة'
      : 'Downloading the chapter fonts';

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator color={COLORS.lightBackground} size={25} />
      <Text style={{marginTop: 5}}>
        {showTxt && txt}

        {chapterProgress > 0 &&
          chapterProgress != 100 &&
          `(${chapterProgress}%)`}
      </Text>
    </View>
  );
};

export default Loader;
