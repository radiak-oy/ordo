import { addDays, format, setHours, setMinutes, setSeconds } from 'date-fns';
import createApi, {
  AddTimesheetEntryDto,
  DoneGigDto,
  EditTimesheetEntryDto,
  TimesheetEntryDto,
} from '../api';
import { useRef, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import GigInfo from './GigInfo';
import { useNavigate } from 'react-router-dom';

interface GigDoneProps {
  className: string;
  gig: DoneGigDto;
  timesheetEntry?: TimesheetEntryDto;
}

export default function GigDone({
  className,
  gig,
  timesheetEntry,
}: GigDoneProps) {
  const navigate = useNavigate();

  const { addTimesheetEntry, editTimesheetEntry } = createApi();

  const now = new Date();

  const gigStartDate = new Date(gig.start);
  const gigEndDate = new Date(gig.end);

  const gigStartTime = format(gigStartDate, 'HH:mm');
  const gigEndTime = format(gigEndDate, 'HH:mm');

  const isOngoing = gigEndDate >= now;

  const originalClockInTime =
    timesheetEntry != null
      ? format(new Date(timesheetEntry.clockIn), 'HH:mm')
      : null;

  const originalClockOutTime =
    timesheetEntry?.clockOut != null
      ? format(new Date(timesheetEntry.clockOut), 'HH:mm')
      : null;

  const [clockInTime, setClockInTime] = useState<string>(
    originalClockInTime ?? gigStartTime
  ); // HH:mm
  const [clockOutTime, setClockOutTime] = useState<string>(
    originalClockOutTime ?? (isOngoing ? format(now, 'HH:mm') : gigEndTime)
  ); // HH:mm

  const [state, setState] = useState<
    'adding' | 'waiting' | 'editing' | 'confirmed'
  >(
    timesheetEntry != null
      ? timesheetEntry.isConfirmed
        ? 'confirmed'
        : 'waiting'
      : 'adding'
  );

  const [errorMessage, setErrorMessage] = useState('');

  const inputClockInRef = useRef<HTMLInputElement>(null);
  const inputClockOutRef = useRef<HTMLInputElement>(null);

  function timeAsDate(time: string) {
    const parts = time.split(':');

    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    const date = setSeconds(
      setMinutes(setHours(gigStartDate, hours), minutes),
      0
    );

    return date;
  }

  async function confirmWorkHours(e: React.FormEvent) {
    e.preventDefault();

    setErrorMessage('');

    const clockInDate = timeAsDate(clockInTime);

    const clockOutDateTemp = timeAsDate(clockOutTime);
    const clockOutDate =
      clockOutDateTemp < gigStartDate
        ? addDays(clockOutDateTemp, 1)
        : clockOutDateTemp;

    if (!inputClockInRef.current || !inputClockOutRef.current)
      throw new Error();

    inputClockInRef.current.setCustomValidity('');
    inputClockOutRef.current.setCustomValidity('');

    const now = new Date();

    if (clockInDate > now) {
      inputClockInRef.current.setCustomValidity('Ei voi olla tulevaisuudessa.');
      inputClockInRef.current.reportValidity();

      return;
    }

    if (clockOutDate > now) {
      inputClockOutRef.current.setCustomValidity(
        'Ei voi olla tulevaisuudessa.'
      );
      inputClockOutRef.current.reportValidity();

      return;
    }

    if (clockInDate < gigStartDate) {
      inputClockInRef.current.setCustomValidity(
        'Ei voi olla ennen keikan alkamista.'
      );
      inputClockInRef.current.reportValidity();

      return;
    }

    if (clockOutDate > gigEndDate) {
      inputClockOutRef.current.setCustomValidity(
        'Ei voi olla keikan päättymisen jälkeen.'
      );
      inputClockOutRef.current.reportValidity();

      return;
    }

    const dto = {
      gigId: gig.id,
      clockIn: clockInDate.toISOString(),
      clockOut: clockOutDate.toISOString(),
    };

    const result =
      state === 'adding'
        ? await addTimesheetEntry(dto as AddTimesheetEntryDto)
        : await editTimesheetEntry(dto as EditTimesheetEntryDto);

    if (!result.ok) {
      setErrorMessage('Työtuntien tallentaminen epäonnistui.');
      return;
    }

    setState('waiting');

    navigate(0);
  }

  return (
    <div
      className={`${className} p-2 flex flex-col items-start rounded border-2 border-secondary-300 hover:border-secondary-400`}
    >
      <GigInfo gig={gig} />
      <form
        className="mt-2 flex flex-col items-start"
        onSubmit={confirmWorkHours}
      >
        <span>Työtunnit</span>
        <div className="flex">
          <input
            ref={inputClockInRef}
            type="time"
            value={clockInTime}
            onChange={(e) => setClockInTime(e.target.value)}
            className="max-w-[6rem]"
            disabled={state === 'waiting' || state === 'confirmed'}
          />
          <span className="mx-1">&mdash;</span>
          <input
            ref={inputClockOutRef}
            type="time"
            value={clockOutTime}
            onChange={(e) => setClockOutTime(e.target.value)}
            className="max-w-[6rem]"
            disabled={state === 'waiting' || state === 'confirmed'}
          />
        </div>

        {(state === 'adding' || state === 'editing') && (
          <button
            type="button"
            className="mt-2 !py-1 btn-primary"
            onClick={confirmWorkHours}
          >
            <MdCheck className="mr-2" />
            Vahvista työtunnit
          </button>
        )}

        {state === 'waiting' && (
          <div className="mt-1 flex flex-col items-start text-secondary-700">
            <span>Odottaa hyväksyntää...</span>
            <button
              type="button"
              className="underline underline-offset-4 hover:text-secondary-600"
              onClick={() => setState('editing')}
            >
              Muokkaa
            </button>
          </div>
        )}

        {state === 'confirmed' && (
          <span className="mt-1 text-secondary-700">Hyväksytty.</span>
        )}

        {errorMessage.length > 0 && (
          <span className="text-red-500">{errorMessage}</span>
        )}
      </form>
    </div>
  );
}
