import { useQuery } from '@tanstack/react-query';

import httpRequest from '@/utils/api/httpRequest';

async function getKeywords() {
  const { data } = await httpRequest.get<string[]>('/keywords');

  return data;
}

const useGetKeywords = () => {
  const queryKey = ['keywords'];
  const { data } = useQuery(queryKey, async () => getKeywords());

  return data;
};

export default useGetKeywords;
