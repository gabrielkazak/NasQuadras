import { useQuery } from '@tanstack/react-query';

const useTeam = (teamName) => {
  return useQuery({
    queryKey: ['team', teamName],
    queryFn: async () => {
      const res = await fetch(`/api/teams/search?name=${teamName}`);
      if (!res.ok) throw new Error('Erro ao buscar time');
      return res.json();
    },
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 60,
  });
};

export default useTeam