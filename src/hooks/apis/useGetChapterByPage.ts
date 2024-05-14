import {useEffect, useState} from 'react';
import {IChapterLookUp, IChapterVerses, ISurahVerse} from '../../types';
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
  const [isLoading, setIsLoading] = useState(true);

  const {downoladThePageFont} = usePageFontFileController();
  const {_renderVersesNewForm} = usePageLineController();

  useEffect(() => {
    if (chapterLookUp?.length && chapterLookUp)
      checkIfTheChapterFileExistsInLocalStorage();
  }, [chapterLookUp]);
  const setChapetersHandler = (chapters: IChapterVerses[]) => {
    setChapterVerse([...chapters]);
  };

  const checkIfTheChapterFileExistsInLocalStorage = async () => {
    const chapterFileName = `${chapterId}.json`;
    const chapterPath = `${QURAN_CHAPTERS_DIRECTORY}/${chapterFileName}`;
    const isFileExistsLocaly = await isFileExists(chapterPath);
    await handleQuranChaptersDirectory();
    if (!isFileExistsLocaly) {
      const res: IChapterVerses[] | undefined = await getTargetChapterPage();
      console.log(JSON.stringify(res));
      await saveChapterAsJsonFile(chapterFileName, JSON.stringify(res));
      await handleFontLoad();
      if (res) setChapetersHandler([...res]);
    } else {
      const storedChapterFile = await readFromLocalStorageFile(chapterFileName);
      await handleFontLoad();
      if (storedChapterFile)
        setChapetersHandler([...JSON.parse(storedChapterFile)]);
    }
  };
  const handleFontLoad = async () => {
    if (!chapterLookUp) return;
    const promises = chapterLookUp?.map((item: IChapterLookUp) =>
      downoladThePageFont(Number(item?.page_number), () => {}, QURAN_FONTS_API),
    );
    try {
      const promiseRes = await Promise.all(promises);
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
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
  return {chapterVerses, isLoading};
};

export default useGetChapterByPage;
