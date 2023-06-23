/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { PropsWithChildren, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import ManageRoot from './routes/manage/root';
import WorkerRoot from './routes/root';
import ManageGigs from './routes/manage/gigs';
import './index.css';
import Login from './routes/login';
import { AuthContext } from './context/auth-context';
import { IconContext } from 'react-icons';
import ErrorPage from './error-page';
import GigsPost from './routes/manage/gigs/post';
import GigsEdit from './routes/manage/gigs/edit';
import Staff from './routes/manage/staff';
import StaffEdit from './routes/manage/staff/edit';
import GigsUpcoming from './routes/gigs/upcoming';
import GigsDone from './routes/gigs/done';
import createApi, { GigDto, ProfileDto, QualificationDto } from './api';
import Index from './routes';

function ProtectedRoute({ children }: PropsWithChildren) {
  const [username, setUsername] = useState(
    /username=(\w*);?/.exec(document.cookie)?.[1] ?? null
  );

  const [role, setRole] = useState<'manager' | 'worker' | null>(
    (/role=(\w*);?/.exec(document.cookie)?.[1] as 'manager' | 'worker') ?? null
  );

  const { logout: logoutApi } = createApi();

  if (username == null || role == null) {
    return <Navigate to="/login" replace />;
  }

  async function logout() {
    await logoutApi();
    setUsername(null);
    setRole(null);

    document.cookie = 'username=;role=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.reload();
  }

  return (
    <AuthContext.Provider value={{ username, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const router = createBrowserRouter([
  {
    path: '/login',
    errorElement: <ErrorPage />,
    element: <Login />,
  },
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <ProtectedRoute>
        <WorkerRoot />
      </ProtectedRoute>
    ),
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Index />,
          },
          {
            path: 'gigs',
            children: [
              { index: true, element: <Navigate to="upcoming" replace /> },
              {
                path: 'upcoming',
                element: <GigsUpcoming />,
                loader: async ({ request }) => {
                  return fetch('/api/gigs/upcoming', {
                    signal: request.signal,
                  });
                },
              },
              {
                path: 'done',
                element: <GigsDone />,
                loader: async ({ request }) => {
                  return fetch('/api/gigs/done', {
                    signal: request.signal,
                  });
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/manage',
    element: (
      <ProtectedRoute>
        <ManageRoot />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Navigate to="gigs" replace /> },
          {
            path: 'gigs',
            children: [
              {
                index: true,
                element: <ManageGigs />,
                loader: async ({ request }) => {
                  return fetch('/api/gigs', {
                    signal: request.signal,
                  });
                },
              },
              {
                path: 'post',
                element: <GigsPost />,
                loader: async ({ request }) => {
                  return fetch('/api/qualifications', {
                    signal: request.signal,
                  });
                },
              },
              {
                path: ':id',
                element: <GigsEdit />,
                loader: async ({ request, params }) => {
                  const gig = (await (
                    await fetch(`/api/gigs/${params.id!}`, {
                      signal: request.signal,
                    })
                  ).json()) as GigDto;

                  const qualifications = (await (
                    await fetch('/api/qualifications', {
                      signal: request.signal,
                    })
                  ).json()) as QualificationDto[];

                  const profiles = (await (
                    await fetch('/api/profiles', {
                      signal: request.signal,
                    })
                  ).json()) as ProfileDto[];

                  return { gig, qualifications, profiles };
                },
              },
            ],
          },
          {
            path: 'staff',
            children: [
              {
                index: true,
                element: <Staff />,
                loader: async ({ request }) => {
                  return fetch('/api/profiles', { signal: request.signal });
                },
              },
              {
                path: ':id',
                element: <StaffEdit />,
                loader: async ({ request, params }) => {
                  const qualifications = (await (
                    await fetch('/api/qualifications', {
                      signal: request.signal,
                    })
                  ).json()) as QualificationDto[];

                  const profile = (await (
                    await fetch(`/api/profiles/${params.id!}`, {
                      signal: request.signal,
                    })
                  ).json()) as ProfileDto;

                  return { profile, qualifications };
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <IconContext.Provider value={{ size: '1.25rem' }}>
      <RouterProvider router={router} />
    </IconContext.Provider>
  </React.StrictMode>
);
