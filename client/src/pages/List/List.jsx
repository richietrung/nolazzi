/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import styles from './List.module.scss';
import { Job } from '../../components';

const cx = classNames.bind(styles);

function List({ user }) {
    const { listID, listName } = useParams();
    const currentDate = useRef();
    currentDate.current = `${new Date().getFullYear()}-${String(
        new Date().getMonth() + 1
    ).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
    const [jobs, setJobs] = useState([]);
    const [lists, setLists] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const createNewJob = async () => {
        await axios({
            method: 'POST',
            url: `${import.meta.env.VITE_API_BASE_URL}/api/nolazzi/jobs`,
            data: {
                name: 'New Job',
                remindDate: currentDate.current,
                priority: 'none',
                user: user._id,
                list: listID,
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
                    }/api/nolazzi/jobs?sort=remindTime,remindDate&user=${
                        user._id
                    }&remindDate=${
                        currentDate.current
                    }&completed=false&list=${listID}`,
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
    }, [isUpdated, user._id, listID]);
    return (
        <div className={cx('content')}>
            <h1 className={cx('title')}>{listName} Reminders</h1>
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

export default List;
