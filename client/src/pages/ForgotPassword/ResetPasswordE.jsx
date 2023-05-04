/* eslint-disable react/prop-types */
import { useParams } from 'react-router-dom';
import { Fragment } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from '../../components/Form/Form';

axios.defaults.withCredentials = true;

function ResetPasswordE() {
    const { token } = useParams();
    const notify = (status) => {
        if (status === 'success')
            return toast.success('Reset Password Successfully', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        if (status === 'failed')
            return toast.error('Fail To Reset Password', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
    };
    const resetPassword = async (data, func, boolean) => {
        try {
            await axios({
                method: 'POST',
                url: `${
                    import.meta.env.VITE_API_BASE_URL
                }/api/nolazzi/users/resetPassword/${token}`,
                data: data,
            }).then(() => {
                notify('success');
                func(!boolean);
                setTimeout(() => {
                    window.history.pushState({}, '', '/login');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }, 2000);
            });
        } catch (error) {
            notify('failed');
            func(!boolean);
        }
    };
    const resetPasswordArr = [
        {
            someText: 'Invalid password!',
            type: 'password',
            name: 'password',
            id: 'password',
            label: 'Password',
            required: true,
            pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{0,}$',
            minLength: '8',
            maxLength: '16',
        },
        {
            someText: 'Password is not the same!',
            type: 'password',
            name: 'confirmPassword',
            id: 'confirmPassword',
            label: 'Confirm Password',
            required: true,
            pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{0,}$',
            minLength: '8',
            maxLength: '16',
        },
    ];
    return (
        <Fragment>
            <Form
                arr={resetPasswordArr}
                title={'No Lazzi | Reset Password'}
                type={'Reset Password'}
                func={resetPassword}
                ToastContainer={ToastContainer}
            />
        </Fragment>
    );
}

export default ResetPasswordE;
