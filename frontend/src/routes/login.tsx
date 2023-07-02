import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import createApi from '../api';
import Logo from '../ui/Logo';
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const navigate = useNavigate();

  const { login, loginWithGoogle } = createApi();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const loginGoogle = useGoogleLogin({
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (codeResponse: CodeResponse) => {
      setErrorMessage('');
      const result = await loginWithGoogle(codeResponse);

      if (!result.ok) {
        setErrorMessage('Kirjautuminen epäonnistui.');

        return;
      }

      navigate('/');
    },
    flow: 'auth-code',
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    const result = await login(email, password);

    if (!result.ok) {
      setErrorMessage('Kirjautuminen epäonnistui.');
      return;
    }

    navigate('/');
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <Logo />
        <form
          className="mt-4 p-4 m-auto max-w flex flex-col rounded border bg-secondary-50"
          onSubmit={onSubmit}
        >
          <button
            type="button"
            className="mb-2 w-full btn-primary"
            onClick={loginGoogle}
          >
            <svg
              className="mr-2 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            <span>Kirjaudu Google-tilillä</span>
          </button>

          <div className="my-2 flex items-center">
            <div className="grow h-0.5 bg-secondary-300"></div>
            <span className="px-2 text-sm text-secondary-700">tai</span>
            <div className="grow h-0.5 bg-secondary-300"></div>
          </div>

          <label htmlFor="input-email">Sähköpostiosoite</label>
          <input
            id="input-email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
          />

          <label htmlFor="input-password">Salasana</label>
          <input
            id="input-password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />

          <a
            href="/forgot-password"
            className="mb-4 underline underline-offset-4 text-blue-500 hover:text-blue-600"
          >
            Unohditko salasanasi?
          </a>

          <button type="submit" className="w-full btn-primary">
            Kirjaudu sisään
          </button>

          {errorMessage.length > 0 && (
            <span className="mt-2 text-red-500">{errorMessage}</span>
          )}
        </form>
      </div>
    </div>
  );
}
