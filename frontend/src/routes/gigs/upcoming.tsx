import { useLoaderData, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import createApi, { UpcomingGigDto } from '../../api';
import GigUpcoming from '../../components/GigUpcoming';
import GigDone from '../../components/GigDone';

export default function Upcoming() {
  const gigs = useLoaderData() as UpcomingGigDto[];

  const navigate = useNavigate();

  const { signUp, cancelSignUp } = createApi();

  const now = new Date();

  const gigsOngoing = useMemo(
    () =>
      gigs.filter(
        (g) =>
          g.isSignedUp && new Date(g.start) <= now && now <= new Date(g.end)
      ),
    [gigs]
  );

  const gigsSignedUpFor = useMemo(
    () => gigs.filter((g) => g.isSignedUp),
    [gigs]
  );

  const gigsOpen = useMemo(
    () => gigs.filter((g) => !g.isSignedUp && new Date(g.start) >= now),
    [gigs]
  );

  async function onSignUp(id: string) {
    await signUp(id);

    navigate(0);
  }

  async function onCancelSignUp(id: string) {
    await cancelSignUp(id);

    navigate(0);
  }

  return (
    <div className="flex flex-col items-start">
      {gigsOngoing.length > 0 && (
        <>
          <span className="mb-2 font-semibold">Meneillään olevat keikat</span>
          {gigsOngoing.map((gig) => (
            <GigDone key={gig.id} className="mb-2 w-full" gig={gig} />
          ))}
        </>
      )}
      <span className="mb-2 font-semibold">
        Keikat, joihin olet ilmoittautunut
      </span>
      {gigsSignedUpFor.length === 0 && (
        <span className="mb-4 ">Et ole ilmoittautunut keikkoihin.</span>
      )}
      {gigsSignedUpFor.map((gig) => (
        <GigUpcoming
          key={gig.id}
          className="mb-2 w-full"
          gig={gig}
          onSignUp={onSignUp}
          onCancelSignUp={onCancelSignUp}
        />
      ))}
      <span className="mb-2 font-semibold">Avoimet keikat</span>
      {gigsOpen.map((gig) => (
        <GigUpcoming
          key={gig.id}
          className="mb-2 w-full"
          gig={gig}
          onSignUp={onSignUp}
          onCancelSignUp={onCancelSignUp}
        />
      ))}
      {gigsOpen.length === 0 && (
        <span className="mb-4 ">Ei avoimia keikkoja.</span>
      )}
    </div>
  );
}
