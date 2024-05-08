import TrackPlayer from 'react-native-track-player';
import {QURAN_API} from '../../common';
import {axiosInstance} from '../../utils';
import {useState} from 'react';

let timeoutAudio: any;
const useGetChapterAudio = () => {
  const [isVersePositionLoading, setIsVersePositionLoading] = useState(false);
  const getVerseAudio = async (
    reciterId: number,
    verseKey: string,
    callback?: () => void,
    isBeforeOrAfterVerse?: boolean,
  ) => {
    // clear timeout created before
    if (timeoutAudio) clearTimeout(timeoutAudio);
    try {
      // if (isBeforeOrAfterVerse) await TrackPlayer.pause();
      setIsVersePositionLoading(true);
      const url = `${QURAN_API}/audio/reciters/${reciterId}/timestamp?verse_key=${verseKey}`;
      const response = await axiosInstance.get(url);
      const result = response.data?.result;
      setIsVersePositionLoading(false);
      const start = result.timestamp_from / 1000;
      await TrackPlayer.play();
      await TrackPlayer.seekTo(start);
      if (callback) callback();
      const stop = result.timestamp_to / 1000 - result.timestamp_from / 1000;
      timeoutAudio = setTimeout(() => {
        TrackPlayer.pause();
        clearTimeout(timeoutAudio);
      }, stop * 1000);
    } catch (e) {
      setIsVersePositionLoading(false);
    }
  };

  const getChapterAudionUrl = async ({
    reciterId,
    chapterId,
    verse_key,
  }: {
    reciterId: number;
    chapterId: number;
    verse_key?: string;
  }) => {
    const queryParams = {
      chapter: chapterId,
      segments: false,
    };
    const queryString = Object.entries(queryParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');
    try {
      const url = `${QURAN_API}/audio/reciters/${reciterId}/audio_files?${queryString}`;
      const response = await axiosInstance.get(url);
      const chapterAudioFiles = response.data.audio_files;
      setUpChapterAudio(chapterAudioFiles, verse_key, reciterId);
    } catch (error) {}
  };

  const resetTrackPlayer = async () => {
    await TrackPlayer.reset();
  };

  const setUpChapterAudio = async (
    chapterAudioFiles: [{audio_url: string}],
    verse_key?: string,
    reciterId?: number,
  ) => {
    const audioFileUrl = chapterAudioFiles[0].audio_url;
    resetTrackPlayer();
    await TrackPlayer.add([
      {
        id: '1',
        url: audioFileUrl,
        title: 'Al Quran',
        duration: 60,
      },
    ]);
    if (verse_key) getVerseAudio(reciterId as number, verse_key);
  };
  return {getChapterAudionUrl, getVerseAudio, isVersePositionLoading};
};

export default useGetChapterAudio;
