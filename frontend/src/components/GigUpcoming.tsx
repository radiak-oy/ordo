import { format } from 'date-fns';
import { UpcomingGigDto } from '../api';
import { MdPersonAdd, MdPersonRemove } from 'react-icons/md';

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
      <span>{gig.qualification}</span>
      <span>{new Date(gig.start).toLocaleDateString()}</span>
      <span>
        {format(new Date(gig.start), 'HH:mm')}
        &ndash;{format(new Date(gig.end), 'HH:mm')}
      </span>
      <span className="mb-2">{gig.address}</span>
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
