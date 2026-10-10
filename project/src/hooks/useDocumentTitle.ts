import { usePageSeo } from './usePageSeo';

/**
 * Custom hook to update document title
 */
export const useDocumentTitle = (title: string): void => {
  usePageSeo({ title });
};
