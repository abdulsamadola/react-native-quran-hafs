import {useEffect, useState} from 'react';
import {QURAN_API} from '../../common';
import {axiosInstance} from '../../utils';

interface IProps {
  chapterId: number;
  type: 'chapter';
}

const useGetChapterLookup = ({chapterId, type}: IProps) => {
  const [chapterLookUp, setChapterLookUp] = useState<IChapterLookUp[]>();
  useEffect(() => {
    fetchChapterLookUp();
  }, []);
  const fetchChapterLookUp = async () => {
    try {
      let response = await axiosInstance.get(
        `/pages/lookup?${type}_number=${chapterId}`,
      );
      let pageslookup = Object.entries(response?.data?.pages);
      const pageslookupEdited = pageslookup?.map(([key, value]) => ({
        page_number: key,
        page_range: value,
      }));
      setChapterLookUp(pageslookupEdited as IChapterLookUp[]);
    } catch (e) {}
  };
  return {chapterLookUp};
};

export default useGetChapterLookup;
