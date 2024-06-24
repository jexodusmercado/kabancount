import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import weekday from 'dayjs/plugin/weekday'

export const formatToDate = (date: string | number | Date) => {
    dayjs.extend(relativeTime)
    dayjs.extend(weekday)

    if (!date) {
        return ''
    }

    const dayjsDate = dayjs(date)
    return dayjsDate.format('MMM D, YYYY')
}
