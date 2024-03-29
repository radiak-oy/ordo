import { UpcomingGigDto } from '../api';
import { MdPersonAdd, MdPersonRemove } from 'react-icons/md';
import GigInfo from './GigInfo';

interface GigUpcomingProps {
  className: string;
  gig: UpcomingGigDto;
  onSignUp: (id: string) => void;
  onCancelSignUp: (id: string) => void;
}

export default function GigUpcoming({
  className,
  gig,
  onSignUp,
  onCancelSignUp,
}: GigUpcomingProps) {
  return (
    <div
      className={`${className} p-2 flex flex-col items-start rounded border-2 border-secondary-300 hover:border-secondary-400`}
    >
      <GigInfo className="mb-2" gig={gig} />
      {gig.isSignedUp ? (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onCancelSignUp(gig.id)}
        >
          <MdPersonRemove className="mr-2" />
          Peru ilmoittautuminen
        </button>
      ) : (
        <button
          type="button"
          className="btn-primary-outline"
          onClick={() => onSignUp(gig.id)}
        >
          <MdPersonAdd className="mr-2" />
          Ilmoittaudu
        </button>
      )}
    </div>
  );
}
