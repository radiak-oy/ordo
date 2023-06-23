import { format } from 'date-fns';
import { DoneGigDto } from '../api';

interface GigDoneProps {
  className: string;
  gig: DoneGigDto;
}

export default function GigDone({ className, gig }: GigDoneProps) {
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
    </div>
  );
}
