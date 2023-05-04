/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';

import styles from './FormLayout.module.scss';
import { Header } from '../../components';

const cx = classNames.bind(styles);

function FormLayout({ title, user, children }) {
    return (
        <div className={cx('App')}>
            {title === 'NoLazzi | Profile' ? <Header user={user} /> : null}
            {children}
        </div>
    );
}

export default FormLayout;
