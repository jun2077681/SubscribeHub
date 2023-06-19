import { useQuery } from '@tanstack/react-query';

import httpRequest from '@/utils/api/httpRequest';

export interface ArticleContent {
  articleId: number;
  articleNum: number;
  url: string;
  nickname: string;
  title: string;
  writer: string;
  written_date: string;
  viewCount: number;
  recommendCount: number;
  commentCount: number;
}

interface GetArticlesRequestParams {
  siteId?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string[];
}

export interface GetArticlesRequest extends GetArticlesRequestParams {}

async function getArticles({ siteId, startDate, endDate, keyword }: GetArticlesRequestParams) {
  const { data } = await httpRequest.get<ArticleContent[]>('/articles', {
    params: {
      siteId,
      startDate,
      endDate,
      keyword,
    },
  });
  return data;
}

const useGetArticles = ({ siteId, startDate, endDate, keyword }: GetArticlesRequest) => {
  const queryKey = ['articles'];
  const { data } = useQuery(queryKey, async () => getArticles({ siteId, startDate, endDate, keyword }), {
    refetchOnMount: true,
  });
  return data;
};

const useGetArticlesInterval = ({ siteId, startDate, endDate, keyword }: GetArticlesRequest) => {
  const queryKey = ['articles', 'interval'];
  const { data } = useQuery(queryKey, async () => getArticles({ siteId, startDate, endDate, keyword }), {
    refetchOnMount: true,
    refetchInterval: 300000,
    refetchIntervalInBackground: true,
  });
  return data;
};

export { useGetArticles, useGetArticlesInterval };
