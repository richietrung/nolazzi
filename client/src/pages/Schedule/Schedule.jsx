/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import axios from 'axios';
import { useEffect, useState } from 'react';

import styles from './Schedule.module.scss';
import { Job } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Schedule({ user }) {
    const [jobs, setJobs] = useState([]);
    const [lists, setLists] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [currentDate, setCurrentDate] = useState(
        `${new Date().getFullYear()}-${String(
            new Date().getMonth() + 1
        ).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
    );
    const createNewJob = async () => {
        await axios({
            method: 'POST',
            url: `${import.meta.env.VITE_API_BASE_URL}/api/nolazzi/jobs`,
            data: {
                name: 'New Job',
                priority: 'none',
                remindDate: currentDate,
                user: user._id,
            },
        });
        setIsUpdated(true);
    };
    useEffect(() => {
        async function fetchAPI() {
            try {
                const resJobs = await axios({
                    method: 'GET',
                    url: `${
                        import.meta.env.VITE_API_BASE_URL
                    }/api/nolazzi/jobs?sort=remindTime,remindDate&remindDate=${currentDate}&user=${
                        user._id
                    }&completed=false`,
                });
                setJobs(resJobs.data.data.docs);
                const resLists = await axios({
                    method: 'GET',
                    url: `${
                        import.meta.env.VITE_API_BASE_URL
                    }/api/nolazzi/lists?user=${user._id}`,
                });
                setLists(resLists.data.data.docs);
            } catch (error) {
                console.log(error);
            }
        }
        fetchAPI();
        if (isUpdated) {
            setIsUpdated(false);
        }
    }, [isUpdated, user._id]);
    return (
        <div className={cx('content')}>
            <div className={cx('searchBox')}>
                <input
                    type="date"
                    className={cx('search')}
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                />
                <button
                    className={cx('searchBtn')}
                    onClick={() => setIsUpdated(true)}
                >
                    <span className={cx('icon')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                </button>
            </div>
            {jobs.map((job) => (
                <Job
                    data={job}
                    lists={lists}
                    key={job._id}
                    setIsUpdated={setIsUpdated}
                />
            ))}
            <button
                className={cx('createBtn')}
                onClick={async () => await createNewJob()}
            >
                Create A Job
            </button>
        </div>
    );
}

export default Schedule;
