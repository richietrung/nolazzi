import {
    faCalendar,
    faCalendarDays,
} from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle, faFlag } from '@fortawesome/free-solid-svg-icons';

export const datas = [
    {
        icon: faCalendar,
        title: 'Today',
        to: '/',
        color: '#2ECC71',
    },
    {
        icon: faCalendarDays,
        title: 'Schedule',
        to: '/schedule',
        color: '#EC7063',
    },
    {
        icon: faFlag,
        title: 'Flagged',
        to: '/flagged',
        color: '#F4D03F',
    },
    {
        icon: faCheckCircle,
        title: 'Completed Today',
        to: '/completed',
        color: '#3498DB',
    },
];
