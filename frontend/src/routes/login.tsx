import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import createApi from '../api';

export default function Login() {
  const navigate = useNavigate();

  const { login } = createApi();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await login(username, password);

    if (!result.ok) {
      setErrorMessage(result.errorMessage);
      return;
    }

    navigate('/');
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        className="p-4 m-auto max-w-xs flex flex-col rounded border bg-secondary-50"
        onSubmit={onSubmit}
      >
        <label htmlFor="input-username">Käyttäjänimi</label>
        <input
          id="input-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-2"
        />

        <label htmlFor="input-password">Salasana</label>
        <input
          id="input-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />

        <button type="submit" className="mb-2 w-full btn-primary">
          Kirjaudu sisään
        </button>

        <span className="text-red-500">{errorMessage}</span>
      </form>
    </div>
  );
}
