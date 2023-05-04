/* eslint-disable react/prop-types */
import { Fragment, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from '../../components/Form/Form';

axios.defaults.withCredentials = true;

function ForgotPassword({ user }) {
    const notify = (status) => {
        if (status === 'success')
            return toast.success('Sending mail successfully!', {
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
            return toast.error('Email does not exist!', {
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
    const forgotPassword = async (data) => {
        try {
            const res = await axios({
                method: 'POST',
                url: `${
                    import.meta.env.VITE_API_BASE_URL
                }/api/nolazzi/users/forgot-password/`,
                data: {
                    ...data,
                    clientURL: import.meta.env.VITE_CLIENT_URL,
                },
            });
            notify('success');
            console.log(res);
        } catch (error) {
            notify('failed');
        }
    };
    const forgotPasswordArr = [
        {
            someText: 'Invalid email address!',
            type: 'text',
            name: 'email',
            id: 'email',
            label: 'Email',
            required: true,
            pattern: '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$',
        },
    ];
    return (
        <Fragment>
            <Form
                arr={forgotPasswordArr}
                title={'No Lazzi | Forgot Password'}
                type={'Send Mail'}
                func={forgotPassword}
                ToastContainer={ToastContainer}
            />
        </Fragment>
    );
}

export default ForgotPassword;
