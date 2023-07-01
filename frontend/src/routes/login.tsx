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
    <div className="min-h-screen flex items-center">
      <div className="m-auto flex flex-col items-center">
        <Logo />
        <form
          className="mt-4 p-4 m-auto max-w-xs flex flex-col rounded border bg-secondary-50"
          onSubmit={onSubmit}
        >
          <button
            type="button"
            className="mb-2 w-full btn-primary"
            onClick={loginGoogle}
          >
            Google
          </button>

          <div className="my-2 flex items-center">
            <div className="grow h-0.5 bg-secondary-300"></div>
            <span className="px-2 text-sm">tai</span>
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
            className="mb-4 underline underline-offset-4 text-blue-500"
          >
            Unohditko salasanasi?
          </a>

          <button type="submit" className="mb-2 w-full btn-primary">
            Kirjaudu sisään
          </button>

          <span className="text-red-500">{errorMessage}</span>
        </form>
      </div>
    </div>
  );
}
