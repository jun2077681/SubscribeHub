import { Global } from '@emotion/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import globalStyles from '@/styles/globalStyles';

import Root from './Root';

const root = document.getElementById('root');

root &&
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Global styles={globalStyles} />
      <Root />
    </React.StrictMode>,
  );
