import {useEffect, useState} from 'react';
import {IChapterLookUp, IChapterVerses, ISurahVerse} from '../../@types';
import {DEFAULT_VERSES_PARAMS, QURAN_CHAPTERS_DIRECTORY} from '../../common';
import {
  axiosInstance,
  handleQuranChaptersDirectory,
  isFileExists,
  readFromLocalStorageFile,
  saveChapterAsJsonFile,
} from '../../utils';
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
    if (chapterLookUp?.length && chapterLookUp)
      checkIfTheChapterFileExistsInLocalStorage();
  }, [chapterLookUp]);

  const checkIfTheChapterFileExistsInLocalStorage = async () => {
    const chapterFileName = `${chapterId}.json`;
    const chapterPath = `${QURAN_CHAPTERS_DIRECTORY}/${chapterFileName}`;
    const isFileExistsLocaly = await isFileExists(chapterPath);
    await handleQuranChaptersDirectory();
    let chapterToBeDisplayed: IChapterVerses[] = [];
    if (!isFileExistsLocaly) {
      const res: IChapterVerses[] | undefined = await getTargetChapterPage();
      if (res) chapterToBeDisplayed = res;
      await saveChapterAsJsonFile(chapterFileName, JSON.stringify(res));
      handleFontLoad(setChapterVerse([...chapterToBeDisplayed]));
    } else {
      const storedChapterFile = await readFromLocalStorageFile(chapterFileName);
      if (storedChapterFile)
        chapterToBeDisplayed = JSON.parse(storedChapterFile);
      handleFontLoad(setChapterVerse([...chapterToBeDisplayed]));
    }
  };
  const handleFontLoad = async (callback: () => void) => {
    if (!chapterLookUp) return;
    const promises = chapterLookUp?.map((item: IChapterLookUp) =>
      downoladThePageFont(Number(item?.page_number), () => {}, QURAN_FONTS_API),
    );
    try {
      const promiseRes = await Promise.all(promises);
      console.log(promiseRes);
      setIsLoading(false);
      callback();
    } catch (e) {}
  };

  const getTargetChapterPage = async () => {
    const params = _rednerQueryParams();
    try {
      const response = await axiosInstance.get(
        `/verses/by_${type}/${chapterId}?${params}`,
      );
      const allChapterVerses: ISurahVerse[] = response?.data?.verses;
      return await handleAllChapterPagesFormat(allChapterVerses);
    } catch (e) {}
  };
  const handleAllChapterPagesFormat = async (
    allChapterVerses: ISurahVerse[],
  ) => {
    const chapterPagesWithVersesToSave = [];
    if (chapterLookUp)
      for (let i = 0; i < chapterLookUp.length; i++) {
        const currentPage: any = chapterLookUp[i]?.page_number;
        const currentPageVerses = allChapterVerses?.filter(
          item => item?.page_number == currentPage,
        );
        const currentPageJuzNumber = currentPageVerses[0]?.juz_number;
        chapterPagesWithVersesToSave.push({
          verses: _renderVersesNewForm({
            pageVerses: currentPageVerses,
          }),
          page_number: currentPage,
          juz_number: currentPageJuzNumber,
          originalVerses: currentPageVerses,
        });
      }

    return chapterPagesWithVersesToSave;
  };
  const onEndReached = () => {
    // if (pagination?.current_page < pagination?.total_pages)
    setActivePage(activePage + 1);
  };

  const _rednerQueryParams = () => {
    if (chapterLookUp) {
      const firstChapterVerse = chapterLookUp[0]?.page_range?.from;
      const lastChapterVerse =
        chapterLookUp[chapterLookUp?.length - 1]?.page_range?.to;

      const queryParams = {
        ...DEFAULT_VERSES_PARAMS,
        from: firstChapterVerse,
        to: lastChapterVerse,
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
