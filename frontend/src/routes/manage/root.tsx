import { NavLink, Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <div className="min-h-screen flex">
      <div className="flex flex-col">
        <NavLink
          to="keikat"
          className={({ isActive }) =>
            isActive ? 'px-2 text-white bg-primary-500' : 'px-2'
          }
        >
          Keikat
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
