import {useEffect, useState} from 'react';
import {IChapterLookUp, QuranTypesEnums} from '../../types';
import {axiosInstance} from '../../utils';

interface IProps {
  chapterId: number;
  type: QuranTypesEnums;
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
      console.log(response.data);
      const pageslookupEdited = pageslookup?.map(([key, value]) => ({
        page_number: key,
        page_range: value,
      }));
      console.log(JSON.stringify(pageslookupEdited));
      setChapterLookUp(pageslookupEdited as IChapterLookUp[]);
    } catch (e) {}
  };
  return {chapterLookUp};
};

export default useGetChapterLookup;
