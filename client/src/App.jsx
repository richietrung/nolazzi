import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import routes from './routes';
import './App.scss';

axios.defaults.withCredentials = true;

function App() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                await axios({
                    method: 'POST',
                    url: `${
                        import.meta.env.VITE_API_BASE_URL
                    }/api/nolazzi/users/refreshToken`,
                });
                const res = await axios({
                    method: 'GET',
                    url: `${
                        import.meta.env.VITE_API_BASE_URL
                    }/api/nolazzi/users/userinfo`,
                });
                setUser(res.data.user);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchData();
    }, []);
    return (
        <Routes>
            {routes.map((route) => {
                const Layout = route.layout || <div className="App"></div>;
                const Component = route.element || <h1>Hello</h1>;
                return (
                    <Route
                        key={`name/${route.path}`}
                        path={route.path}
                        element={
                            <Layout user={user} title={route.title}>
                                <Component user={user} />
                            </Layout>
                        }
                    />
                );
            })}
        </Routes>
    );
}

export default App;
