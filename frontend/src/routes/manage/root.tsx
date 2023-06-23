import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import { MdLogout } from 'react-icons/md';

export default function Root() {
  const { username, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen border-t-4 border-primary-500">
      <div className="mx-auto px-4 py-2 max-w-xl flex justify-between items-center">
        <div className="flex">
          <NavLink
            to="gigs"
            className={({ isActive }) => `mr-8  ${isActive ? 'font-bold' : ''}`}
          >
            Keikat
          </NavLink>
          <NavLink
            to="staff"
            className={({ isActive }) => `mr-8  ${isActive ? 'font-bold' : ''}`}
          >
            Henkilöstö
          </NavLink>
        </div>
        <div className="flex items-center">
          <span className="mr-2 font-medium">{username}</span>

          <button
            type="button"
            onClick={logout}
            className="p-2 rounded text-secondary-700 hover:bg-secondary-100"
          >
            <MdLogout />
          </button>
        </div>
      </div>
      <hr />
      <div className="mx-auto p-4 max-w-xl">
        <Outlet />
      </div>
    </div>
  );
}
