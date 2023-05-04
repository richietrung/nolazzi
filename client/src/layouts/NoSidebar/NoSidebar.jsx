/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import { Fragment } from 'react';

import styles from './NoSidebar.module.scss';
import { Header } from '../../components';

const cx = classNames.bind(styles);

function DefaultLayout({ user, title, children }) {
    document.title = title;
    return (
        <div className={cx('App')}>
            {user ? (
                <Fragment>
                    <Header user={user} />
                    <div className={cx('body')}>{children}</div>
                </Fragment>
            ) : (
                <Fragment>
                    <Header />
                    <div className={cx('body')}>
                        <h1>Welcome Page</h1>
                    </div>
                </Fragment>
            )}
        </div>
    );
}

export default DefaultLayout;
