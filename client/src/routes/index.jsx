import { FormLayout, DefaultLayout, NoSidebar } from '../layouts';
import {
    Login,
    SignUp,
    Home,
    ForgotPassword,
    ResetPasswordE,
    Schedule,
    Flagged,
    Completed,
    List,
    Profile,
} from '../pages';

const routes = [
    {
        element: Login,
        path: '/login',
        layout: FormLayout,
        title: 'Login',
    },
    {
        element: SignUp,
        path: '/register',
        layout: FormLayout,
        title: 'Register',
    },
    {
        element: ForgotPassword,
        path: '/forgot-password',
        layout: FormLayout,
        title: 'Forgot Password',
    },
    {
        element: ResetPasswordE,
        path: '/forgot-password/reset-password/:token',
        layout: FormLayout,
        title: 'Reset Password',
    },
    {
        element: Home,
        path: '/',
        layout: DefaultLayout,
        title: 'NoLazzi | Home',
    },
    {
        element: Schedule,
        path: '/schedule',
        layout: DefaultLayout,
        title: 'NoLazzi | Schedule',
    },
    {
        element: Flagged,
        path: '/flagged',
        layout: DefaultLayout,
        title: 'NoLazzi | Flagged',
    },
    {
        element: Completed,
        path: '/completed',
        layout: DefaultLayout,
        title: 'NoLazzi | Completed',
    },
    {
        element: List,
        path: '/list/:listID/:listName',
        layout: DefaultLayout,
        title: 'NoLazzi | List',
    },
    {
        element: Profile,
        path: '/profile',
        layout: NoSidebar,
        title: 'NoLazzi | Profile',
    },
];

export default routes;
