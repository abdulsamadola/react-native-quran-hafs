import {useEffect, useState} from 'react';
import {IChapterLookUp, IChapterVerses} from '../../@types';
import {DEFAULT_VERSES_PARAMS} from '../../common';
import {axiosInstance} from '../../utils';
import {usePageFontFileController, usePageLineController} from '../controllers';

interface IProps {
  chapterLookUp: IChapterLookUp[] | undefined;
  chapterId: number;
  type: 'chapter';
  QURAN_FONTS_API: string;
}
const useGetChapterByPage = ({
  chapterLookUp,
  chapterId,
  type,
  QURAN_FONTS_API,
}: IProps) => {
  const [chapterVerses, setChapterVerse] = useState<IChapterVerses[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {downoladThePageFont} = usePageFontFileController();
  const {_renderVersesNewForm} = usePageLineController();

  useEffect(() => {
    if (chapterLookUp?.length && chapterLookUp) getTargetChapterPage();
  }, [chapterLookUp, activePage]);

  const getTargetChapterPage = async () => {
    const params = _rednerQueryParams();
    try {
      const targetPageNumber =
        chapterLookUp && chapterLookUp[activePage]?.page_number;
      const response = await axiosInstance.get(
        `/verses/by_${type}/${chapterId}?${params}`,
      );

      const page_number = response?.data?.verses[0]?.page_number;
      downoladThePageFont(
        targetPageNumber as any,
        () => {
          setChapterVerse([
            ...chapterVerses,
            {
              verses: _renderVersesNewForm({
                pageVerses: response?.data?.verses,
              }),
              page_number,
            },
          ]);
          if (isLoading) setIsLoading(false);
        },
        QURAN_FONTS_API,
      );
    } catch (e) {}
  };
  const onEndReached = () => {
    // if (pagination?.current_page < pagination?.total_pages)
    setActivePage(activePage + 1);
  };

  const _rednerQueryParams = () => {
    if (chapterLookUp) {
      const activePageData = chapterLookUp[activePage];
      const queryParams = {
        ...DEFAULT_VERSES_PARAMS,
        from: activePageData?.page_range?.from,
        to: activePageData?.page_range?.to,
      };
      const queryString = Object.entries(queryParams)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join('&');
      return queryString;
    } else return '';
  };
  return {chapterVerses, onEndReached, isLoading};
};

export default useGetChapterByPage;
