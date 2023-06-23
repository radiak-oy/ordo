import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

export default function Index() {
  const { role } = useContext(AuthContext);

  if (role === 'manager') return <Navigate to="manage/gigs" replace />;

  return <Navigate to="gigs/upcoming" replace />;
}
