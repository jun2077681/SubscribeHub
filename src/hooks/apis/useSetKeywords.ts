import { useMutation, useQueryClient } from '@tanstack/react-query';

import httpRequest from '@/utils/api/httpRequest';

async function setKeywords(keywords: string[]) {
  await httpRequest.put('/keywords', keywords);
}

const useSetKeywords = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: setKeywords,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['keywords']);
    },
  });

  return { isLoading: mutation.isLoading, setKeywords: mutation.mutate };
};

export default useSetKeywords;
