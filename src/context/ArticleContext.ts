import constate from 'constate';
import { useEffect, useState } from 'react';

import type { ArticleContent, GetArticlesRequest } from '@/hooks/apis/useGetArticles';
import { useGetArticlesInterval } from '@/hooks/apis/useGetArticles';
import useGetKeywords from '@/hooks/apis/useGetKeywords';

export const [ArticleContextProvider, useArticleContext] = constate(() => {
  const [articleFilter, setArticleFilter] = useState<GetArticlesRequest>({});
  const keywords = useGetKeywords();

  const addedArticles = useGetArticlesInterval({
    ...articleFilter,
  });
  const [articles, setArticles] = useState<ArticleContent[]>(addedArticles ?? []);

  useEffect(() => {
    if (addedArticles?.length) {
      const newArticles = [...articles];
      addedArticles.forEach((article) => {
        if (!newArticles.some((a) => a.articleNum === article.articleNum)) {
          newArticles.push(article);

          if (keywords?.some((keyword) => article.title.includes(keyword))) {
            const notification = new Notification('SubscribeHub 키워드 알림', {
              body: article.title,
              actions: [],
            });
            notification.onclick = (event) => {
              event.preventDefault();
              window.open(article.url, '_blank');
            };
          }
        }
      });
      setArticles(newArticles);
    }
  }, [addedArticles]);

  return { articles, setArticles, articleFilter, setArticleFilter };
});
