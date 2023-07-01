import { NavLink, Outlet } from 'react-router-dom';
import { MdSettings } from 'react-icons/md';
import Logo from '../ui/Logo';

export default function Root() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-2 max-w-xl flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
          <NavLink
            to="gigs/upcoming"
            className={({ isActive }) =>
              `ml-6 mr-4 p-2 ${isActive ? 'font-bold' : ''}`
            }
          >
            Keikat
          </NavLink>
          <NavLink
            to="gigs/done"
            className={({ isActive }) => `p-2 ${isActive ? 'font-bold' : ''}`}
          >
            Historia
          </NavLink>
        </div>
        <NavLink
          to="settings"
          className={({ isActive }) => (isActive ? '' : 'text-secondary-500')}
        >
          <MdSettings />
        </NavLink>
      </div>
      <hr />
      <div className="mx-auto p-4 max-w-xl">
        <Outlet />
      </div>
    </div>
  );
}
