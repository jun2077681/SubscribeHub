import { useMutation, useQueryClient } from '@tanstack/react-query';

import httpRequest from '@/utils/api/httpRequest';

interface UserSites {
  siteId: number;
  url: string;
  nickname: string;
}

async function setUserSites(sites: UserSites[]) {
  await httpRequest.put('/sites', sites);
}

const useSetUserSites = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: setUserSites,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['sites', 'user-sites']);
    },
  });

  return { isLoading: mutation.isLoading, setUserSites: mutation.mutate };
};

export default useSetUserSites;
