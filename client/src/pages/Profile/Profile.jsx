/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './Profile.module.scss';
import UserProfile from './UserProfile';
import UserAuth from './UserAuth';

const cx = classNames.bind(styles);

axios.defaults.withCredentials = true;

function Profile({ user }) {
    const [data, setData] = useState({
        email: user.email,
        accountName: user.accountName,
    });
    const notify = (status, message = null) => {
        if (status === 'success')
            return toast.success('Succeeded', {
                position: 'top-center',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        if (status === 'failed')
            return toast.error(`${message ? message : 'Failed'}`, {
                position: 'top-center',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
    };
    return (
        <div className={cx('profile-box')}>
            <UserProfile
                user={user}
                data={data}
                setData={setData}
                notify={notify}
            />
            <UserAuth
                user={user}
                data={data}
                setData={setData}
                notify={notify}
            />
            <ToastContainer />
        </div>
    );
}

export default Profile;
