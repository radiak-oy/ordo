import { useLoaderData, useNavigate } from 'react-router-dom';
import { MdAdd, MdKeyboardArrowDown } from 'react-icons/md';
import { useMemo, useState } from 'react';
import ManagerGig from '../../../components/manage/ManagerGig';
import { differenceInCalendarDays, isSameDay } from 'date-fns';
import { GigDto } from '../../../api';

export default function Index() {
  const navigate = useNavigate();

  const gigs = useLoaderData() as GigDto[];

  const [showPastGigs, setShowPastGigs] = useState(false);

  const now = new Date();

  const gigsPast = useMemo(
    () => gigs.filter((g) => new Date(g.end) < now),
    [now, gigs]
  );

  const gigsOngoing = useMemo(
    () =>
      gigs.filter((g) => new Date(g.start) <= now && new Date(g.end) >= now),
    [now, gigs]
  );

  const dateGigGroups = useMemo(
    () =>
      gigs
        .filter((g) => new Date(g.start) > now)
        .reduce((groups, gig: GigDto) => {
          const date = gig.start.split('T')[0];
          if (!groups[date]) groups[date] = [];

          groups[date].push(gig);

          return groups;
        }, {} as { [date: string]: GigDto[] }),
    [gigs]
  );

  return (
    <div className="flex flex-col items-start">
      <button
        className="mb-4 btn-primary-outline"
        onClick={() => navigate('post')}
      >
        <MdAdd className="mr-1" />
        Julkaise keikka
      </button>

      {gigs.length === 0 && <span className="mb-2">Ei keikkoja.</span>}
      {gigsPast.length > 0 && (
        <div className="mb-2 w-full flex flex-col">
          <button
            className="flex justify-between items-center rounded hover:bg-secondary-100"
            onClick={() => setShowPastGigs((old) => !old)}
          >
            <span className="mb-1 font-semibold">Menneet</span>
            <MdKeyboardArrowDown
              className={`mr-1 ${showPastGigs ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
          <div className={showPastGigs ? '' : 'hidden'}>
            {gigsPast.map((gig) => (
              <ManagerGig
                key={gig.id}
                className="mb-2"
                type="past"
                gig={gig}
                onClick={() => navigate(gig.id)}
              />
            ))}
          </div>
        </div>
      )}

      {gigsOngoing.length > 0 && (
        <div className="mb-2 w-full flex flex-col">
          <span className="mb-1 font-semibold">Meneillään</span>
          {gigsOngoing.map((gig) => (
            <ManagerGig
              key={gig.id}
              className="mb-2"
              type="ongoing"
              gig={gig}
              onClick={() => navigate(gig.id)}
            />
          ))}
        </div>
      )}

      {Object.entries(dateGigGroups).map(([date, gigs]) => (
        <div key={date} className="mb-2 w-full flex flex-col">
          <span className="mb-1 font-semibold">
            {isSameDay(new Date(date), now)
              ? 'Tänään'
              : differenceInCalendarDays(new Date(date), now) === 1
              ? 'Huomenna'
              : new Date(date).toLocaleDateString()}
          </span>
          {gigs.map((gig) => (
            <ManagerGig
              key={gig.id}
              className="mb-2"
              type="upcoming"
              gig={gig}
              onClick={() => navigate(gig.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
