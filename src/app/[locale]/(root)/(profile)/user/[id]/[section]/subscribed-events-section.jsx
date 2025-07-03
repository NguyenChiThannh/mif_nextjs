import { DialogCreateEvent } from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-create-event'
import CardEvent, { CardEventSkeleton } from '@/components/card-event'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { eventApi } from '@/services/eventApi'
import React from 'react'

export default function SubscribedEventsSection() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    eventApi.query.useGetSubscribedEvents()

  const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage)

  return (
    <>
      <div className='flex-1 mt-4'>
        <div className='grid gap-8 mt-4 w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
          {isLoading && (
            <>
              {Array.from({ length: 8 }).map((_, index) => {
                return <CardEventSkeleton key={index} />
              })}
            </>
          )}
          {data?.pages?.map((page) =>
            page.content.map((event) => (
              <CardEvent key={event.id} event={event} />
            )),
          )}
          {isFetchingNextPage && <CardEventSkeleton />}
          <div ref={observerElem}></div>
        </div>
      </div>
    </>
  )
}
