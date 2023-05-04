import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './components/GlobalStyles/index.jsx';

import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </BrowserRouter>
    </React.StrictMode>
);
