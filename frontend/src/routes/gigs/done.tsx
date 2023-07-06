import { useLoaderData } from 'react-router-dom';
import { DoneGigDto, TimesheetEntryDto } from '../../api';
import GigDone from '../../components/GigDone';
import { useMemo } from 'react';

export default function Done() {
  const { gigsDone, timesheetEntries } = useLoaderData() as {
    gigsDone: DoneGigDto[];
    timesheetEntries: TimesheetEntryDto[];
  };

  const gigsOngoing = useMemo(
    () => gigsDone.filter((g) => new Date(g.end) >= new Date()),
    [gigsDone]
  );

  const gigsPast = useMemo(
    () => gigsDone.filter((g) => new Date(g.end) < new Date()),
    [gigsDone]
  );

  return (
    <div className="flex flex-col items-start">
      {gigsOngoing.length > 0 && (
        <span className="mb-2 font-semibold">Meneillään olevat keikat</span>
      )}
      {gigsOngoing.map((gig) => (
        <GigDone
          key={gig.id}
          className="mb-2 w-full"
          gig={gig}
          timesheetEntry={timesheetEntries.find((t) => t.gigId === gig.id)}
        />
      ))}
      <span className="mb-2 font-semibold">Suorittamani keikat</span>
      {gigsPast.length === 0 && <span>Et ole suorittanut keikkoja.</span>}
      {gigsPast.map((gig) => (
        <GigDone
          key={gig.id}
          className="mb-2 w-full"
          gig={gig}
          timesheetEntry={timesheetEntries.find((t) => t.gigId === gig.id)}
        />
      ))}
    </div>
  );
}
