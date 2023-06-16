import { useLoaderData } from 'react-router-dom';
import { GigDto } from '../../../api';

export default function Index() {
  const gigs = useLoaderData() as GigDto[];
  return (
    <div className="flex flex-col">
      {gigs.map((x) => (
        <div key={x.id}>
          {x.id} {new Date(x.start).toLocaleString()}
        </div>
      ))}
    </div>
  );
}
