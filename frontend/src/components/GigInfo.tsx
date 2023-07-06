import { differenceInCalendarDays, format } from 'date-fns';
import { DoneGigDto, GigDto, UpcomingGigDto } from '../api';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function GigInfo({
  className,
  gig,
  type,
}: {
  className?: string;
  gig: GigDto | UpcomingGigDto | DoneGigDto;
  type?: 'upcoming' | 'ongoing' | 'past';
}) {
  const startDate = new Date(gig.start);
  const endDate = new Date(gig.end);

  const isManagerGig = 'workerIds' in gig;
  const isFull = isManagerGig && gig.workerIds.length === gig.maxWorkers;
  const isTomorrow =
    differenceInCalendarDays(new Date(gig.start), new Date()) <= 1;

  const [showFullDescription, setShowFullDescription] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLSpanElement>(null);

  const [isDescriptionOverflowing, setIsDescriptionOverflowing] =
    useState(false);

  useEffect(() => {
    setIsDescriptionOverflowing(
      descriptionRef.current && containerRef.current
        ? descriptionRef.current.offsetWidth > containerRef.current.offsetWidth
        : false
    );
  }, []);

  return (
    <div className={`${className ?? ''} w-full flex flex-col`}>
      {isManagerGig ? (
        <div className="w-full flex justify-between font-medium">
          <span>{gig.qualification.name}</span>
          <span
            className={
              isFull && type === 'upcoming'
                ? 'text-green-500'
                : isTomorrow && type === 'upcoming'
                ? 'text-yellow-500'
                : 'text-secondary-500'
            }
          >
            {gig.workerIds.length}/{gig.maxWorkers}{' '}
            {type === 'upcoming' ? 'ilmoittautunut' : 'tekijää'}
          </span>
        </div>
      ) : (
        <span>{gig.qualification}</span>
      )}
      <span>{startDate.toLocaleDateString()}</span>
      <span>
        {format(startDate, 'HH:mm')}
        &ndash;{format(endDate, 'HH:mm')}
      </span>
      <span>{gig.address}</span>

      {gig.description.length > 0 && (
        <div
          ref={containerRef}
          className="w-full overflow-hidden text-ellipsis"
        >
          <span
            ref={descriptionRef}
            className={`${
              showFullDescription ? '' : 'whitespace-nowrap'
            } w-full text-secondary-700`}
            title={gig.description}
          >
            {gig.description}
          </span>
          {isDescriptionOverflowing && !isManagerGig && (
            <button
              type="button"
              className="block whitespace-nowrap text-secondary-700 underline underline-offset-4"
              onClick={() => setShowFullDescription((show) => !show)}
            >
              {showFullDescription ? 'Piilota' : 'Näytä'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
