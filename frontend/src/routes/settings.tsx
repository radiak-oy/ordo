import { useContext } from 'react';
import { MdLogout } from 'react-icons/md';
import { AuthContext } from '../context/auth-context';

export default function Settings() {
  const { username, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-start">
      <span className="mb-2 font-semibold">Asetukset</span>
      <span className="mb-2">
        Kirjautuneena sisään käyttäjänä{' '}
        <b className="font-medium">{username}</b>
      </span>
      <button type="button" className="btn-secondary" onClick={logout}>
        <MdLogout className="mr-2" /> <span>Kirjaudu ulos</span>
      </button>
    </div>
  );
}
