import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { privateApi } from "@/services/config"
import { QUERY_KEY } from "@/services/key"
import { useTranslations } from "next-intl"


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
    const res = await privateApi.post(`/events/${id}/unsubscribe`)
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
        useCreateEvent(groupId) {
            const t = useTranslations('Toast')
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: createEvent,
                onSuccess: () => {
                    toast.success(t('create_event_successful'))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.getEventsByGroupId(groupId) })
                }
            })
        },
        useSubscribeToEvent() {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: subscribeToEvent,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.getSubscribedEvents() })
                }
            })
        },
        useUnsubscribeFromEvent() {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: unsubscribeFromEvent,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.getSubscribedEvents() })
                }
            })
        },
        useDeleteEvent() {
            return useMutation({
                mutationFn: deleteEvent,
            })
        }
    }
}