/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import { Fragment, useState } from 'react';

import FormInput from './FormInput/FormInput';
import styles from './Form.module.scss';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function Form({
    arr,
    title,
    type,
    func,
    ToastContainer,
    headerTitle,
    children,
    submitBtn,
    user = false,
}) {
    useEffect(() => {
        document.title = title;
    }, [title]);
    //const data = new FormData()
    const [data, setData] = useState(
        arr.reduce((acc, val) => {
            acc[val.id] = '';
            return acc;
        }, {})
    );
    const [expired, setExpired] = useState(false);
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (type === 'Reset Password') {
                    await func(data, setExpired, expired);
                } else {
                    await func(data);
                }
                if (type !== 'Send Mail' && type !== 'Reset Password') {
                    setData(() => {
                        const newData = arr.reduce((acc, val) => {
                            acc[val.id] = '';
                            return acc;
                        }, {});
                        return newData;
                    });
                }
                window.location.reload(true);
            }}
            className={cx('form-group')}
        >
            <div className={cx('box')}>
                {expired === true ? (
                    <button className={cx('submit-btn')}>
                        This link is expired!
                    </button>
                ) : (
                    <Fragment>
                        <h1 className={cx('header-title')}>{headerTitle}</h1>
                        {arr.map((el) => {
                            return (
                                <FormInput
                                    arr={el}
                                    key={`${el.id}`}
                                    setData={setData}
                                    pattern={el.pattern}
                                    data={data}
                                    user={user || null}
                                />
                            );
                        })}
                        {children}
                        <button
                            type="submit"
                            className={cx('submitBtn', {
                                submitBtn,
                            })}
                        >
                            {type}
                        </button>
                        <ToastContainer />
                    </Fragment>
                )}
            </div>
        </form>
    );
}

export default Form;
