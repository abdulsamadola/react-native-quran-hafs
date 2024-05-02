import React from 'react';
import {TouchableOpacity, View} from 'react-native';

const AudioPlayerControls = ({
  onPlayPause,
  renderplayPauseBtn,
}: {
  onPlayPause: () => void;
  renderplayPauseBtn: () => React.ReactNode;
}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity style={{marginHorizontal: 12}} onPress={onPlayPause}>
        {renderplayPauseBtn()}
      </TouchableOpacity>
    </View>
  );
};
export default AudioPlayerControls;
