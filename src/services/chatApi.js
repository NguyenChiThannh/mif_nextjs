import { privateApi } from "./config";
import {
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

const QUERY_KEY = {
  groupChats: () => ["group-chats"],
  groupMessages: (groupId) => ["group-messages", groupId],
};

const getGroupChats = async () => {
  const res = await privateApi.get("/group-chats");
  return res.data;
};

const getGroupMessages = async ({ groupId, page = 0, size = 8 }) => {
  const res = await privateApi.get(`/chat/group/${groupId}/messages`, {
    params: { page, size },
  });
  return res.data;
};

const joinGroupChat = async (groupId) => {
  const res = await privateApi.post(`/joined-group-chat?groupId=${groupId}`);
  return res.data;
}

export const chatApi = {
  query: {
    useGetGroupChats() {
      return useInfiniteQuery({
        queryKey: QUERY_KEY.groupChats(),
        queryFn: getGroupChats,
        getNextPageParam: (lastPage) => {
          if (!lastPage || lastPage.last) return undefined;
          return lastPage.number + 1;
        },
      });
    },
    useGetGroupMessages(groupId) {
      return useInfiniteQuery({
        queryKey: QUERY_KEY.groupMessages(groupId),
        queryFn: ({ pageParam = 0 }) =>
          getGroupMessages({ groupId, page: pageParam }),
        getNextPageParam: (lastPage) => {
          if (!lastPage || lastPage.last) return undefined;
          return lastPage.number + 1;
        },
      });
    },
  },
  mutation: {
    useJoinGroupChat() {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: joinGroupChat,
        onSuccess: () => {
          queryClient.invalidateQueries(QUERY_KEY.groupChats());
        },
      });
    },
  },
};
