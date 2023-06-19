import { useMutation } from '@tanstack/react-query';

import httpRequest from '@/utils/api/httpRequest';

interface GetArticleContentsRequest {
  id: number;
}

async function getArticleContents({ id }: GetArticleContentsRequest) {
  const { data } = await httpRequest.get<string>(`/articles/id/${id}`);
  return data;
}

const useGetArticleContents = () => {
  const mutation = useMutation({
    mutationFn: getArticleContents,
  });

  return { isLoading: mutation.isLoading, getArticleContents: mutation.mutateAsync };
};

export default useGetArticleContents;
