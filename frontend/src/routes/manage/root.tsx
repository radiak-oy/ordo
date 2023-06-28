import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import { MdLogout } from 'react-icons/md';
import Logo from '../../ui/Logo';

export default function Root() {
  const { username, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-2 max-w-xl flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
          <NavLink
            to="gigs"
            className={({ isActive }) =>
              `ml-6 mr-4 p-2 ${isActive ? 'font-bold' : ''}`
            }
          >
            Keikat
          </NavLink>
          <NavLink
            to="staff"
            className={({ isActive }) => `p-2 ${isActive ? 'font-bold' : ''}`}
          >
            Henkilöstö
          </NavLink>
        </div>
        <div className="flex items-center">
          <span className="mr-2 hidden xs:inline font-medium">{username}</span>

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
