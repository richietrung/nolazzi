/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import axios from 'axios';

import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

axios.defaults.withCredentials = true;

function UserAuth({ data, setData, notify }) {
    const handleSubmit = async () => {
        try {
            const newData = {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword,
            };
            const res = await axios({
                method: 'POST',
                url: `${
                    import.meta.env.VITE_API_BASE_URL
                }/api/nolazzi/users/reset-password`,
                data: newData,
            });
            if (res.status === 200) {
                await axios({
                    method: 'GET',
                    url: `${
                        import.meta.env.VITE_API_BASE_URL
                    }/api/nolazzi/users/logout/`,
                });
                window.location.href = '/login';
            }
        } catch (error) {
            notify('failed', 'Wrong current password!');
            console.log(error);
        }
    };
    return (
        <>
            {/* currentPassword, newPassword, confirmNewPassword */}
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    await handleSubmit();
                }}
                className={cx('data')}
            >
                <h1 style={{ textAlign: 'center' }}>Change Password</h1>
                <label className={cx('label')} htmlFor="currentPassword">
                    Current Password
                </label>
                <input
                    className={cx('input')}
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    required
                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{0,}$"
                    minLength="8"
                    maxLength="16"
                    value={data.currentPassword || ''}
                    onChange={(e) =>
                        setData({ ...data, currentPassword: e.target.value })
                    }
                />
                <span className={cx('error')}>Invalid password!</span>
                <label className={cx('label')} htmlFor="newPassword">
                    New Password
                </label>
                <input
                    className={cx('input', 'accountName')}
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{0,}$"
                    value={data.newPassword || ''}
                    onChange={(e) =>
                        setData({ ...data, newPassword: e.target.value })
                    }
                />
                <span className={cx('error')}>Invalid password!</span>
                <label className={cx('label')} htmlFor="confirmNewPassword">
                    Confirm New Password
                </label>
                <input
                    className={cx('input', 'accountName')}
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    required
                    pattern={data.newPassword}
                    value={data.confirmNewPassword || ''}
                    onChange={(e) =>
                        setData({ ...data, confirmNewPassword: e.target.value })
                    }
                />
                <span className={cx('error')}>Password is not the same!</span>
                <button type="submit" className={cx('saveBtn')}>
                    Reset Password
                </button>
            </form>
        </>
    );
}

export default UserAuth;
