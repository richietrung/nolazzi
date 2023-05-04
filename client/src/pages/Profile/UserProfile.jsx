/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import axios from 'axios';

import styles from './Profile.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

axios.defaults.withCredentials = true;

function UserProfile({ user, data, setData, notify }) {
    const [fileName, setFileName] = useState(null);
    const [objURL, setObjURL] = useState(
        `${import.meta.env.VITE_API_BASE_URL}/${user.photo}` ||
            '../../assets/default.png'
    );
    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('accountName', data.accountName);
            formData.append('photo', data.photo);
            await axios({
                method: 'PATCH',
                url: `${
                    import.meta.env.VITE_API_BASE_URL
                }/api/nolazzi/users/updateMe`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            });
            notify('success');
            setTimeout(() => window.location.reload(), 3000);
        } catch (error) {
            notify('failed');
            console.log(error);
        }
    };
    return (
        <>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    await handleSubmit();
                }}
                className={cx('data')}
            >
                <h1 style={{ textAlign: 'center' }}>Update Profile</h1>
                <div className={cx('img')}>
                    <img src={objURL} alt="avatar" />
                </div>
                <label
                    className={cx('label', 'center', 'photo')}
                    htmlFor="photo"
                >
                    {fileName ? fileName : 'Upload photo'}
                </label>
                <input
                    className={cx('input', 'photo', 'center')}
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => {
                        setData({ ...data, photo: e.target.files[0] });
                        setFileName(e.target.files[0].name);
                        console.log(e.target.files[0]);
                        setObjURL(URL.createObjectURL(e.target.files[0]));
                    }}
                    style={{ display: 'none' }}
                />
                <label className={cx('label')} htmlFor="email">
                    Email
                </label>
                <input
                    className={cx('input', 'email')}
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={data.email}
                    onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                    }
                />
                <span className={cx('error')}>Invalid email!</span>
                <label className={cx('label')} htmlFor="accountName">
                    Account Name
                </label>
                <input
                    className={cx('input', 'accountName')}
                    type="text"
                    id="accountName"
                    name="accountName"
                    required
                    pattern="^[a-zA-Z0-9_ ]*$"
                    value={data.accountName}
                    onChange={(e) =>
                        setData({ ...data, accountName: e.target.value })
                    }
                />
                <span className={cx('error')}>Invalid account name!</span>
                <button type="submit" className={cx('saveBtn')}>
                    Save
                </button>
            </form>
        </>
    );
}

export default UserProfile;
