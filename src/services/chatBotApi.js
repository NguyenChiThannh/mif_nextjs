import { QUERY_KEY } from "@/services/key";
import { privateApi } from "./config";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const chatWithBot = async (body) => {
  const res = await privateApi.post("ai/chat", body);
  return res.data;
};

const getHistoryChatBot = async ({ pageParam = 0, queryKey }) => {
  const [_key] = queryKey;
  const res = await privateApi.get("ai/history", {
    params: {
      page: pageParam,
    },
  });
  return res.data;
};

const deleteHistoryChatBot = async () => {
  const res = await privateApi.delete(`ai/history`);
  return res.data;
};

export const chatBotApi = {
  query: {
    useGetHistoryChatBot() {
      return useInfiniteQuery({
        queryKey: QUERY_KEY.historyChatBot(),
        queryFn: getHistoryChatBot,
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length;
          return lastPage.last ? undefined : nextPage;
        },
      });
    },
  },
  mutation: {
    useChatWithBot() {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: chatWithBot,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY.historyChatBot(),
          });
        },
      });
    },
    useDeleteHistoryChatBot() {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: deleteHistoryChatBot,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY.historyChatBot(),
          });
        },
      });
    },
  },
};
