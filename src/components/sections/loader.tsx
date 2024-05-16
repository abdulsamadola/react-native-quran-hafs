import {ActivityIndicator, I18nManager, Text, View} from 'react-native';
import {COLORS} from '../../common';

const Loader = () => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator color={COLORS.lightBackground} size={25} />
      <Text style={{marginTop: 5}}>
        {I18nManager.isRTL
          ? 'جاري تحميل ملقات السورة'
          : 'Downloading the chapter files'}
      </Text>
    </View>
  );
};

export default Loader;
