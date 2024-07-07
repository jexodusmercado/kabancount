import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import weekday from 'dayjs/plugin/weekday'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

export const formatToDate = (date: string | number | Date) => {
    dayjs.extend(relativeTime)
    dayjs.extend(weekday)

    if (!date) {
        return ''
    }

    const dayjsDate = dayjs(date)
    return dayjsDate.format('MMM D, YYYY')
}

export const formatDateToRFC1233 = (date: string | number | Date) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.tz.guess()

    if (!date) {
        return ''
    }

    return dayjs(date).format('ddd, DD MMM YYYY HH:mm:ss ZZ')
}
