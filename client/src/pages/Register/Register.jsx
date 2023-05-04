/* eslint-disable react/prop-types */
import { Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from '../../components/Form/Form';

axios.defaults.withCredentials = true;

function SignUp({ user }) {
    useEffect(() => {
        if (user) window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
    });
    const signUpArr = [
        {
            someText: 'Invalid email address!',
            type: 'text',
            name: 'email',
            id: 'email',
            label: 'Email',
            required: true,
            pattern: '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$',
        },
        {
            someText:
                'Account name must not include any numbers and special characters!',
            type: 'text',
            name: 'accountName',
            id: 'accountName',
            label: 'Account Name',
            required: true,
            pattern: '^[a-zA-Z0-9_ ]*$',
        },
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
    const notify = (status) => {
        if (status === 'success')
            return toast.success('Sign Up Succeeded', {
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
            return toast.error('Sign Up Failed', {
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
    const signUp = async (data) => {
        try {
            const res = await axios({
                method: 'POST',
                url: `${
                    import.meta.env.VITE_API_BASE_URL
                }/api/nolazzi/users/signup/`,
                data: data,
            });
            if (!res.status === 'success') {
                return notify('failed');
            }
            notify('success');
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (error) {
            notify('failed');
        }
    };
    return (
        <Fragment>
            <Form
                arr={signUpArr}
                title={'No Lazzi | Register'}
                func={signUp}
                type={'Register'}
                headerTitle={'Welcome to NoLazzi'}
                ToastContainer={ToastContainer}
            >
                <Link
                    style={{
                        display: 'inlineBlock',
                        textDecoration: 'none',
                        width: '13.6rem',
                        color: 'blue',
                    }}
                    to="/forgot-password"
                >
                    Forgot Password
                </Link>
                <Link
                    style={{
                        display: 'inlineBlock',
                        textDecoration: 'none',
                        width: '13.6rem',
                        color: 'blue',
                    }}
                    to="/login"
                >
                    Login
                </Link>
            </Form>
        </Fragment>
    );
}

export default SignUp;
