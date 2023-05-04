/* eslint-disable react/prop-types */
import { Fragment, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from '../../components/Form/Form';

axios.defaults.withCredentials = true;

function Login({ user }) {
    const notify = (status) => {
        if (status === 'success')
            return toast.success('Login Succeeded', {
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
            return toast.error('Login Failed', {
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
    useEffect(() => {
        if (user) window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
    });
    const login = async (data) => {
        try {
            await axios({
                method: 'POST',
                url: `${
                    import.meta.env.VITE_API_BASE_URL
                }/api/nolazzi/users/login/`,
                data: data,
            });
            notify('success');
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (error) {
            notify('failed');
        }
    };
    const loginArr = [
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
    ];
    return (
        <Fragment>
            <Form
                arr={loginArr}
                title={'No Lazzi | Login'}
                type={'Login'}
                func={login}
                ToastContainer={ToastContainer}
                headerTitle={'Welcome Back'}
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
                        maxWidth: '20rem',
                        color: 'blue',
                    }}
                    to="/register"
                >
                    Click here to register
                </Link>
            </Form>
        </Fragment>
    );
}

export default Login;
