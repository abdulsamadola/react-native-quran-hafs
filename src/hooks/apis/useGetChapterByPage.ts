import {useEffect, useState} from 'react';
import {
  IChapterLookUp,
  IChapterVerses,
  ISurahVerse,
  QuranTypesEnums,
} from '../../types';
import {
  DEFAULT_VERSES_PARAMS,
  QURAN_CHAPTERS_DIRECTORY,
  QURAN_JUZS_DIRECTORY,
} from '../../common';
import {
  axiosInstance,
  handleQuranChaptersDirectory,
  handleQuranJuzsDirectory,
  isFileExists,
  readFromLocalStorageFile,
  saveChapterAsJsonFile,
} from '../../utils';
import {usePageFontFileController, usePageLineController} from '../controllers';
interface IProps {
  chapterLookUp: IChapterLookUp[] | undefined;
  chapterId: number;
  type: QuranTypesEnums;
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
  const [chapterProgress, setChapterProgress] = useState(0);

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
    const chapterPath = `${
      type === QuranTypesEnums?.chapter
        ? QURAN_CHAPTERS_DIRECTORY
        : QURAN_JUZS_DIRECTORY
    }/${chapterFileName}`;
    const isFileExistsLocaly = await isFileExists(chapterPath);
    if (type === QuranTypesEnums.chapter) await handleQuranChaptersDirectory();
    else await handleQuranJuzsDirectory();

    if (!isFileExistsLocaly) {
      const res: IChapterVerses[] | undefined = await getTargetChapterPage();
      await saveChapterAsJsonFile(chapterFileName, JSON.stringify(res), type);
      await handleFontLoad();
      if (res) setChapetersHandler([...res]);
    } else {
      const storedChapterFile = await readFromLocalStorageFile(
        chapterFileName,
        type,
      );
      await handleFontLoad();
      if (storedChapterFile)
        setChapetersHandler([...JSON.parse(storedChapterFile)]);
    }
  };
  const handleFontLoad = async () => {
    if (!chapterLookUp) return;
    const promises = chapterLookUp?.map((item: IChapterLookUp, index) => {
      return downoladThePageFont(
        Number(item?.page_number),
        () => {},
        QURAN_FONTS_API,
      );
    });
    try {
      const promiseRes = await Promise.all(promises);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (e) {}
  };

  const getTargetChapterPage = async () => {
    const params = _rednerQueryParams();
    try {
      const response = await axiosInstance.get(
        `/verses/by_${type}/${chapterId}?${params}`,
        {
          onDownloadProgress: progressEvent => {
            if (progressEvent && progressEvent?.total) {
              setChapterProgress(
                Math.round((progressEvent.loaded / progressEvent?.total) * 100),
              );
            }
          },
        },
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
        const chapter_id = currentPageVerses[0]?.chapter_id;
        const isFirstChapterPage = currentPageVerses[0]?.verse_number == 1;
        chapterPagesWithVersesToSave.push({
          verses: _renderVersesNewForm({
            pageVerses: currentPageVerses,
          }),
          page_number: currentPage,
          juz_number: currentPageJuzNumber,
          originalVerses: currentPageVerses,
          chapter_id,
          isFirstChapterPage,
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
  return {chapterVerses, isLoading, chapterProgress};
};

export default useGetChapterByPage;
