import { NavLink, Outlet } from 'react-router-dom';
import { MdSettings } from 'react-icons/md';
import Logo from '../../ui/Logo';

export default function Root() {
  return (
    <div className="mx-auto min-h-screen max-w-xl flex flex-col">
      <div className="px-4 py-2 flex justify-between items-center">
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
        <NavLink
          to="settings"
          className={({ isActive }) => (isActive ? '' : 'text-secondary-500')}
        >
          <MdSettings />
        </NavLink>
      </div>
      <hr />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}
