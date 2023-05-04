/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';

import styles from './Completed.module.scss';
import { Job } from '../../components';

const cx = classNames.bind(styles);

function Completed({ user }) {
    const currentDate = useRef();
    currentDate.current = `${new Date().getFullYear()}-${String(
        new Date().getMonth() + 1
    ).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
    const [jobs, setJobs] = useState([]);
    const [lists, setLists] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    useEffect(() => {
        async function fetchAPI() {
            try {
                const resJobs = await axios({
                    method: 'GET',
                    url: `${
                        import.meta.env.VITE_API_BASE_URL
                    }/api/nolazzi/jobs?sort=remindTime&user=${
                        user._id
                    }&completed=true`,
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
            <h1 className={cx('title')}>Completed Reminders</h1>
            {jobs.map((job) => (
                <Job
                    data={job}
                    lists={lists}
                    key={job._id}
                    setIsUpdated={setIsUpdated}
                    edit={false}
                    check={false}
                />
            ))}
        </div>
    );
}

export default Completed;
