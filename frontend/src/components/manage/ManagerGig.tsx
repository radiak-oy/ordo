import { GigDto } from '../../api';
import GigInfo from '../GigInfo';

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
  return (
    <div
      className={`${className} p-2 w-full flex flex-col rounded cursor-pointer border-2 border-secondary-300 hover:border-secondary-400`}
      onClick={() => onClick()}
    >
      <GigInfo gig={gig} type={type} />
    </div>
  );
}
