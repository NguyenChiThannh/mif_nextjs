import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { privateApi } from "@/services/config"
import { QUERY_KEY } from "@/services/key"

const createEvent = async (data) => {
    const res = await privateApi.post('/events', data)
    return res.data
}

const deleteEvent = async (id) => {
    const res = await privateApi.post(`/events/${id}`)
    return res.data
}

const subscribeToEvent = async (id) => {
    const res = await privateApi.post(`/events/${id}/subscribe`)
    return res.data
}

const unsubscribeFromEvent = async (id) => {
    const res = await privateApi.post(`/events/${id}/subscribe`)
    return res.data
}

const getSubscribedEvents = async ({ queryKey, pageParam = 0 }) => {
    const res = await privateApi.get('/subscribed-events', {
        params: {
            page: pageParam,
        }
    })
    return res.data
}

const getEventsByGroupId = async ({ queryKey, pageParam = 0 }) => {
    const [_key, groupId] = queryKey;
    const res = await privateApi.get(`/groups/${groupId}/events`, {
        params: {
            page: pageParam,
        }
    })
    return res.data
}

export const eventApi = {
    query: {
        useGetSubscribedEvents() {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.getSubscribedEvents(),
                queryFn: getSubscribedEvents,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            });
        },
        useGetEventsByGroupId(groupId) {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.getEventsByGroupId(groupId),
                queryFn: getEventsByGroupId,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            });
        }
    },
    mutation: {
        useCreateEvent() {
            return useMutation({
                mutationFn: createEvent,
                onSuccess: () => {
                    toast.success('Tạo sự kiện thành công')
                }
            })
        },
        useSubscribeToEvent() {
            return useMutation({
                mutationFn: subscribeToEvent,
            })
        },
        useUnsubscribeFromEvent() {
            return useMutation({
                mutationFn: unsubscribeFromEvent,
            })
        },
        useDeleteEvent() {
            return useMutation({
                mutationFn: deleteEvent,
            })
        }
    }
}