import { differenceInCalendarDays, format } from 'date-fns';
import { GigDto } from '../../api';

interface ManagerGigProps {
  className: string;
  gig: GigDto;
  type: 'upcoming' | 'ongoing' | 'past';
  onClick: () => void;
}

export default function ManagerGig({
  className,
  gig,
  type,
  onClick,
}: ManagerGigProps) {
  const isFull = gig.workerIds.length === gig.maxWorkers;
  const isTomorrow =
    differenceInCalendarDays(new Date(gig.start), new Date()) <= 1 &&
    type === 'upcoming';

  return (
    <div
      className={`${className} p-2 w-full flex flex-col rounded cursor-pointer border-2 border-secondary-300 hover:border-secondary-400`}
      onClick={() => onClick()}
    >
      <div className="w-full flex justify-between font-medium">
        <span>{gig.qualification.name}</span>
        <span
          className={
            isFull
              ? 'text-green-500'
              : isTomorrow
              ? 'text-yellow-500'
              : 'text-secondary-500'
          }
        >
          {gig.workerIds.length}/{gig.maxWorkers}{' '}
          {type === 'upcoming' ? 'ilmoittautunut' : 'tekijää'}
        </span>
      </div>
      <span>{new Date(gig.start).toLocaleDateString()}</span>
      <span>
        {format(new Date(gig.start), 'HH:mm')}
        &ndash;{format(new Date(gig.end), 'HH:mm')}
      </span>
      <span>{gig.address}</span>
    </div>
  );
}
