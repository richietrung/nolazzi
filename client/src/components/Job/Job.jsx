/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import axios from 'axios';
import { Fragment, useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faFlag as faFlagBold } from '@fortawesome/free-solid-svg-icons';

import styles from './Job.module.scss';
import compareTime from '../../utils/compareTime';
import setPriorityColor from '../../utils/setPriorityColor';

const cx = classNames.bind(styles);

const Job = memo(function Job({
    data,
    lists,
    setIsUpdated,
    edit = true,
    check = true,
}) {
    const [unfinished, setUnfinished] = useState(
        compareTime({
            time: data.remindTime || null,
            date: data.remindDate.split('T')[0] || null,
        })
    );
    console.log(data.remindTime, data.remindDate.split('T')[0]);
    console.log(unfinished);
    const [editing, setEditing] = useState(false);
    const [jobData, setJobData] = useState(() => {
        // eslint-disable-next-line no-unused-vars
        let { _id, ...rest } = data;
        return rest;
    });
    const completeJob = async (id) => {
        await axios({
            method: 'PATCH',
            url: `${
                import.meta.env.VITE_API_BASE_URL
            }/api/nolazzi/jobs/complete/${id}`,
        });
        setIsUpdated(true);
    };
    const saveJobEdited = async (id) => {
        await axios({
            method: 'PATCH',
            url: `${import.meta.env.VITE_API_BASE_URL}/api/nolazzi/jobs/${id}`,
            data: jobData,
        });
        setIsUpdated(true);
    };
    const deleteJob = async (id) => {
        await axios({
            method: 'DELETE',
            url: `${import.meta.env.VITE_API_BASE_URL}/api/nolazzi/jobs/${id}`,
        });
        setIsUpdated(true);
    };
    return (
        <Fragment>
            {editing ? (
                <div className={cx('job')}>
                    <div className={cx('infoBox')}>
                        <input
                            type="radio"
                            className={cx('check-circle')}
                            style={{ pointerEvents: 'none' }}
                        />
                        <input
                            type="text"
                            className={cx('name')}
                            onChange={(e) =>
                                setJobData({ ...jobData, name: e.target.value })
                            }
                            value={jobData.name}
                        />
                        <button
                            onClick={async () => {
                                setEditing(!editing);
                                await saveJobEdited(data._id);
                            }}
                            className={cx('btn')}
                        >
                            Save
                        </button>
                    </div>
                    <div className={cx('attributesBox')}>
                        <input
                            type="date"
                            className={cx('date', 'item')}
                            onChange={(e) => {
                                setJobData({
                                    ...jobData,
                                    remindDate: e.target.value,
                                });
                                setUnfinished(
                                    compareTime(
                                        jobData.remindTime,
                                        e.target.value
                                    )
                                );
                            }}
                            value={
                                jobData.remindDate
                                    ? jobData.remindDate.slice(0, 10)
                                    : ''
                            }
                        />
                        <input
                            type="time"
                            className={cx('time', 'item')}
                            onChange={(e) => {
                                setJobData({
                                    ...jobData,
                                    remindTime: e.target.value || 'None',
                                });
                                setUnfinished(
                                    compareTime(
                                        e.target.value,
                                        jobData.remindDate
                                    )
                                );
                            }}
                            value={jobData.remindTime || 'None'}
                        />
                        <select
                            name="priority"
                            id="priority"
                            className={cx('select-box', 'item')}
                            onChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    priority: e.target.value,
                                })
                            }
                            value={jobData.priority}
                        >
                            <option value="none">None</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <select
                            name="repeat"
                            id="repeat"
                            className={cx('select-box', 'item')}
                            onChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    repeat: e.target.value,
                                })
                            }
                            value={jobData.repeat}
                        >
                            <option value="never">Never</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        <select
                            name="list"
                            id="list"
                            className={cx('select-box', 'item')}
                            value={
                                jobData.list
                                    ? jobData.list._id || jobData.list
                                    : 'none'
                            }
                            onChange={(e) => {
                                setJobData((prev) => {
                                    if (e.target.value === 'none') {
                                        return { ...prev, list: null };
                                    }
                                    return { ...prev, list: e.target.value };
                                });
                            }}
                        >
                            <option value="none">None</option>
                            {lists.map((list) => (
                                <option key={list._id} value={list._id}>
                                    {list.name}
                                </option>
                            ))}
                        </select>
                        {jobData.flag ? (
                            <span
                                onClick={() =>
                                    setJobData({
                                        ...jobData,
                                        flag: !jobData.flag,
                                    })
                                }
                                className={cx('flagged')}
                            >
                                <FontAwesomeIcon icon={faFlagBold} />
                            </span>
                        ) : (
                            <span
                                onClick={() =>
                                    setJobData({
                                        ...jobData,
                                        flag: !jobData.flag,
                                    })
                                }
                            >
                                <FontAwesomeIcon icon={faFlag} />
                            </span>
                        )}
                    </div>
                </div>
            ) : (
                <div className={cx('job')}>
                    <div className={cx('infoBox')}>
                        {check && (
                            <input
                                type="radio"
                                className={cx('check-circle', 'item')}
                                onChange={async () =>
                                    await completeJob(data._id)
                                }
                            />
                        )}
                        <span
                            type="text"
                            className={cx('name', 'item', {
                                unfinished: unfinished === 'unfinished',
                            })}
                        >
                            {jobData.name}
                        </span>
                        <div className={cx('btnBox')}>
                            {edit && (
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className={cx('btn')}
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={async () => await deleteJob(data._id)}
                                className={cx('btn')}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <div className={cx('attributesBox')}>
                        <span type="date" className={cx('date', 'item')}>
                            Date:{' '}
                            {jobData.remindDate
                                ? jobData.remindDate.slice(0, 10)
                                : 'None'}
                        </span>
                        <span type="time" className={cx('time', 'item')}>
                            Time:{' '}
                            {jobData.remindTime ? jobData.remindTime : 'None'}
                        </span>
                        <span
                            className={cx('item')}
                            style={{
                                color: `${setPriorityColor(jobData.priority)}`,
                            }}
                        >
                            Priority: {jobData.priority}
                        </span>
                        <span className={cx('item')}>
                            Repeat: {jobData.repeat}
                        </span>
                        <span className={cx('item')}>
                            List: {data.list ? data.list.name : 'none'}
                        </span>
                        {jobData.flag ? (
                            <span className={cx('flagged')}>
                                <FontAwesomeIcon icon={faFlagBold} />
                            </span>
                        ) : (
                            <span>
                                <FontAwesomeIcon icon={faFlag} />
                            </span>
                        )}
                    </div>
                </div>
            )}
        </Fragment>
    );
});

export default Job;
