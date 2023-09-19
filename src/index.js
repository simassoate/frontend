import React from 'react';
import ReactDOM from 'react-dom/client';

import Router from 'Routes';
import { UserProvider } from 'UserContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <Router />
    </UserProvider>
  </React.StrictMode>
);


