'use client'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import React, { useMemo, useRef } from 'react'
import {
  createCalendar,
  getLocalTimeZone,
  getWeeksInMonth,
  CalendarDate,
  isToday as _isToday,
} from '@internationalized/date'
import {
  CalendarProps,
  useButton,
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
  useLocale,
} from 'react-aria'
import { useCalendarState } from 'react-stately'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function Calendar(props) {
  const prevButtonRef = useRef(null)
  const nextButtonRef = useRef(null)

  const { locale } = useLocale()
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  })
  const {
    calendarProps,
    prevButtonProps: _prevButtonProps,
    nextButtonProps: _nextButtonProps,
    title,
  } = useCalendar(props, state)
  const { buttonProps: prevButtonProps } = useButton(
    _prevButtonProps,
    prevButtonRef,
  )
  const { buttonProps: nextButtonProps } = useButton(
    _nextButtonProps,
    nextButtonRef,
  )

  return (
    <div {...calendarProps} className='space-y-4'>
      <div className='relative flex items-center justify-center pt-1'>
        <Button
          {...prevButtonProps}
          ref={prevButtonRef}
          variant={'outline'}
          className={cn(
            'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          )}
        >
          <ChevronLeftIcon className='w-4 h-4' />
        </Button>
        <div className='text-sm font-medium'>{title}</div>
        <Button
          {...nextButtonProps}
          ref={nextButtonRef}
          variant={'outline'}
          className={cn(
            'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          )}
        >
          <ChevronRightIcon className='w-4 h-4' />
        </Button>
      </div>
      <CalendarGrid state={state} />
    </div>
  )
}

function CalendarGrid({ state, ...props }) {
  const { locale } = useLocale()
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table
      {...gridProps}
      className={cn(gridProps.className, 'w-full border-collapse space-y-1')}
    >
      <thead {...headerProps}>
        <tr className='flex'>
          {weekDays.map((day, index) => (
            <th
              className='w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground'
              key={index}
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr className='flex w-full mt-2' key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                ),
              )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CalendarCell({ state, date }) {
  const ref = useRef(null)
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
  } = useCalendarCell({ date }, state, ref)

  const isToday = useMemo(() => {
    const timezone = getLocalTimeZone()
    return _isToday(date, timezone)
  }, [date])

  return (
    <td
      {...cellProps}
      className={cn(
        cellProps.className,
        'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
      )}
    >
      <Button
        {...buttonProps}
        type='button'
        variant={'ghost'}
        ref={ref}
        className={cn(
          buttonProps.className,
          'h-9 w-9',
          isToday ? 'bg-accent text-accent-foreground' : '',
          isSelected
            ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'
            : '',
          isOutsideVisibleRange ? 'text-muted-foreground opacity-50' : '',
          isDisabled ? 'text-muted-foreground opacity-50' : '',
        )}
      >
        {formattedDate}
      </Button>
    </td>
  )
}

export { Calendar }
