import {useEffect, useState} from 'react';
import {QURAN_API} from '../../common';
import {axiosInstance} from '../../utils';
import {IReciter} from '../../@types';
import useGetChapterAudio from './useGetChapterAudio';
import {I18nManager} from 'react-native';

const useGetReciters = ({chapterId}: {chapterId: number}) => {
  const [allReciters, setAllReciters] = useState<IReciter[]>([]);
  const {getChapterAudionUrl} = useGetChapterAudio();
  useEffect(() => {
    getReciters();
  }, []);

  const getReciters = async () => {
    const queryParams = {
      locale: I18nManager.isRTL ? 'ar' : 'en',
      fields: undefined,
    };
    const queryString = Object.entries(queryParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value as any)}`,
      )
      .join('&');
    try {
      const url = `${QURAN_API}/audio/reciters?${queryString}`;
      const response = await axiosInstance.get(url);
      const reciters: IReciter[] = response.data.reciters;
      getChapterAudionUrl({reciterId: reciters[0]?.id, chapterId});
      setAllReciters(reciters);
    } catch (error) {}
  };
  return {allReciters};
};

export default useGetReciters;
