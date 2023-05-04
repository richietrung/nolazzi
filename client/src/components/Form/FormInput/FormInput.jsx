/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Fragment } from 'react';
import classNames from 'classnames/bind';

import styles from './FormInput.module.scss';

const cx = classNames.bind(styles);

function FormInput({ data, pattern, setData, arr }) {
    const [focused, setFocused] = useState(false);
    const { someText, label, ...rest } = arr;
    return (
        <Fragment>
            <label className={cx('label', 'file')} htmlFor={arr.name}>
                {label}
            </label>
            <input
                className={cx('input-tag')}
                {...rest}
                onBlur={() => {
                    setFocused(true);
                }}
                // eslint-disable-next-line react/no-unknown-property
                focused={focused.toString()}
                pattern={arr.id === 'confirmPassword' ? data.password : pattern}
                onChange={(e) =>
                    setData((prev) => {
                        return { ...prev, [arr.id]: e.target.value };
                    })
                }
                value={data[arr.id]}
            />
            <span className={cx('validation-text')}>{someText}</span>
        </Fragment>
    );
}

export default FormInput;
