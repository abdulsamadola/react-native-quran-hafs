import {ActivityIndicator} from 'react-native';
import {COLORS} from '../../common';

const Loader = () => {
  return <ActivityIndicator color={COLORS.lightBackground} size={25} />;
};

export default Loader;
