export const QURAN_API = 'https://api.quran.com/api/qdc';
export const QURAN_FONTS_API =
  'https://qubaa-shared-public.b-cdn.net/qubaa/dev/quran-font/';

export const DEFAULT_VERSES_PARAMS = {
  words: true,
  translation_fields: 'resource_name,language_id',
  per_page: 'all',
  fields: 'text_uthmani,chapter_id,hizb_number,text_imlaei_simple',
  translations: 131,
  reciter: 7,
  word_fields:
    'verse_key,verse_id,page_number,location,text_uthmani,qpc_uthmani_hafs,code_v1,code_v2,uthmani_tajweed',
};
