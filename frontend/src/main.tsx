import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ManageRoot from './routes/manage/root';
import WorkerRoot from './routes/root';
import Gigs from './routes/manage/gigs';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <WorkerRoot />,
  },
  {
    path: '/hallinta',
    element: <ManageRoot />,
    children: [
      {
        path: 'keikat',
        element: <Gigs />,
        loader: async ({ request }) => {
          return fetch('/api/gigs', {
            signal: request.signal,
          });
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
