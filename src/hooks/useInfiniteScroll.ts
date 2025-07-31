import { useEffect, useState, useCallback } from 'react';

export const useInfiniteScroll = (
  fetchMore: () => Promise<void>,
  hasMore: boolean,
  isLoading: boolean
) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching ||
      !hasMore ||
      isLoading
    ) return;
    setIsFetching(true);
  }, [isFetching, hasMore, isLoading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;
    fetchMore().finally(() => setIsFetching(false));
  }, [isFetching, fetchMore]);

  return { isFetching };
};