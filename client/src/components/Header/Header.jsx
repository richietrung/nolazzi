/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import axios from 'axios';

import styles from './Header.module.scss';
import logo from '../../assets/vite.svg';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Header({ user }) {
    const logout = async () => {
        try {
            await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/nolazzi/users/logout/`
            );
            window.location.replace('/login');
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className={cx('navigation')}>
            <img className={cx('logo')} src={logo} />
            <div className={cx('nav__items', 'options')}>
                <Link className={cx('nav__items--a')} to="/">
                    Home
                </Link>
                <Link className={cx('nav__items--a')} to="/">
                    Options
                </Link>
            </div>
            {user ? (
                <div className={cx('nav__items', 'account')}>
                    <button
                        className={cx('nav__items--a', 'btn')}
                        onClick={async () => await logout()}
                    >
                        Logout
                    </button>
                    <Link className={cx('nav__items--a')} to="/profile">
                        <img
                            className={cx('avatar')}
                            src={`${import.meta.env.VITE_API_BASE_URL}${
                                user.photo || '/default.png'
                            }`}
                            alt="avatar"
                        />
                    </Link>
                </div>
            ) : (
                <div className={cx('nav__items', 'account')}>
                    <Link className={cx('nav__items--a')} to="/login">
                        Login
                    </Link>
                    <Link className={cx('nav__items--a')} to="/register">
                        Register
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Header;
