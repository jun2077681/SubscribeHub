import { useMutation } from '@tanstack/react-query';

import httpRequest from '@/utils/api/httpRequest';

interface SearchUserSitesRequestParams {
  searchWord: string;
  siteId: number;
}

interface SearchUserSitesRequest extends SearchUserSitesRequestParams {}

export interface UserSite {
  siteId: number;
  url: string;
  nickname: string;
}

async function searchUserSite({ searchWord, siteId }: SearchUserSitesRequest) {
  const { data } = await httpRequest.get<UserSite[]>('/sites/search-user-sites', {
    params: {
      searchWord,
      siteId,
    },
  });

  return data;
}

const useSearchUserSites = () => {
  const mutation = useMutation({
    mutationFn: searchUserSite,
  });

  return { isLoading: mutation.isLoading, searchUserSite: mutation.mutateAsync };
};

export default useSearchUserSites;
