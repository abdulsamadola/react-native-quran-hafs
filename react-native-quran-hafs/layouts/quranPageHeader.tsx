import {Text, View} from 'react-native';

const QuranPageHeader = ({chapterCodeV1}: {chapterCodeV1: string}) => {
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
      }}>
      <Text
        style={{
          fontFamily: 'QCF_BSML',
          fontSize: 25,
          textAlign: 'center',
        }}>
        {chapterCodeV1} {String.fromCharCode(92)}
      </Text>
    </View>
  );
};

export default QuranPageHeader;
