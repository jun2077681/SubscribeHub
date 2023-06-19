import { useQuery } from '@tanstack/react-query';

import httpRequest from '@/utils/api/httpRequest';

interface Site {
  id: number;
  url: string;
  siteNickname: string;
}

async function getSites() {
  const { data } = await httpRequest.get<Site[]>('/sites');

  return data;
}

const useGetSites = () => {
  const queryKey = ['sites'];
  const { data } = useQuery(queryKey, async () => getSites());

  return data;
};

export default useGetSites;
