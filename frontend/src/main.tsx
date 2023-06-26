/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { PropsWithChildren, useEffect, useState } from 'react';
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
import { GoogleOAuthProvider } from '@react-oauth/google';

function getCookieValueURIDecodedByName(name: string): string | null {
  const value =
    document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))?.[2] ?? null;

  return value ? decodeURIComponent(value) : null;
}

function ProtectedRoute({ children }: PropsWithChildren) {
  const [username, setUsername] = useState(
    getCookieValueURIDecodedByName('username')
  );

  const [role, setRole] = useState<'manager' | 'worker' | null>(
    (getCookieValueURIDecodedByName('role') as 'manager' | 'worker') ?? null
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

function Title({
  children,
  title,
}: React.PropsWithChildren<{ title: string }>) {
  useEffect(() => {
    const oldTitle = document.title;

    document.title = `${title} – Ordo`;

    return () => {
      document.title = oldTitle;
    };
  }, [title]);

  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/login',
    errorElement: <ErrorPage />,
    element: (
      <Title title="Kirjaudu sisään">
        <Login />
      </Title>
    ),
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
                element: (
                  <Title title="Tulevat keikat">
                    <GigsUpcoming />
                  </Title>
                ),
                loader: async ({ request }) => {
                  return fetch('/api/gigs/upcoming', {
                    signal: request.signal,
                  });
                },
              },
              {
                path: 'done',
                element: (
                  <Title title="Historia">
                    <GigsDone />
                  </Title>
                ),
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
                element: (
                  <Title title="Keikat">
                    <ManageGigs />
                  </Title>
                ),
                loader: async ({ request }) => {
                  return fetch('/api/gigs', {
                    signal: request.signal,
                  });
                },
              },
              {
                path: 'post',
                element: (
                  <Title title="Julkaise keikka">
                    <GigsPost />
                  </Title>
                ),
                loader: async ({ request }) => {
                  return fetch('/api/qualifications', {
                    signal: request.signal,
                  });
                },
              },
              {
                path: ':id',
                element: (
                  <Title title="Muokkaa keikkaa">
                    <GigsEdit />
                  </Title>
                ),
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
                element: (
                  <Title title="Henkilöstö">
                    <Staff />
                  </Title>
                ),
                loader: async ({ request }) => {
                  return fetch('/api/profiles', { signal: request.signal });
                },
              },
              {
                path: ':id',
                element: (
                  <Title title="Muokkaa henkilöä">
                    <StaffEdit />
                  </Title>
                ),
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
    <GoogleOAuthProvider clientId="591214992994-69hk2kaa2avd64d0lf1nlgau38fnviud.apps.googleusercontent.com">
      <IconContext.Provider value={{ size: '1.25rem' }}>
        <RouterProvider router={router} />
      </IconContext.Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
