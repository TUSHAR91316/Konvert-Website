import { useEffect } from 'react';

/**
 * Custom hook to update document title on mount and restore default on unmount
 */
export const useDocumentTitle = (title: string, defaultTitle = 'Konvert'): void => {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = defaultTitle;
    };
  }, [title, defaultTitle]);
};
