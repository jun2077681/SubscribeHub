import { useQuery } from '@tanstack/react-query';

import httpRequest from '@/utils/api/httpRequest';

interface UserSite {
  siteId: number;
  url: string;
  nickname: string;
}

async function getUserSites() {
  const { data } = await httpRequest.get<UserSite[]>('/sites/user-sites');

  return data;
}

const useGetUserSites = () => {
  const queryKey = ['sites', 'user-sites'];
  const { data } = useQuery(queryKey, async () => getUserSites());

  return data;
};

export default useGetUserSites;
