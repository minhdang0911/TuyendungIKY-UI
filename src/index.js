import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    //     {/* <SimpleBar style={{ maxHeight: '300', maxWidth: '300', overflow: 'auto' }}> */}
    //     <App />
    //     {/* </SimpleBar> */}
    // </React.StrictMode>,

    // <React.StrictMode>
    <>
        <App />
    </>,
    // </React.StrictMode>,
);
