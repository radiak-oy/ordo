import { useLoaderData } from 'react-router-dom';
import { DoneGigDto } from '../../api';
import GigDone from '../../components/GigDone';

export default function Done() {
  const gigsDone = useLoaderData() as DoneGigDto[];

  return (
    <div className="flex flex-col items-start">
      <span className="mb-2 font-semibold">Suorittamani keikat</span>
      {gigsDone.length === 0 && <span>Et ole suorittanut keikkoja.</span>}
      {gigsDone.map((gig) => (
        <GigDone key={gig.id} className="mb-2 w-full" gig={gig} />
      ))}
    </div>
  );
}
