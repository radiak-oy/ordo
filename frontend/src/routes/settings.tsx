import { useContext } from 'react';
import { MdLogout } from 'react-icons/md';
import { AuthContext } from '../context/auth-context';

export default function Settings() {
  const { username, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-start">
      <span className="mb-2 font-semibold">Ilmoitukset</span>
      <label className="mb-2 relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        <span className="ml-3">Keikat</span>
      </label>
      <span className="mb-2 font-semibold">Tili</span>
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
