import { useRef, useState } from 'react';
import { MdAdd, MdArrowBack, MdDeleteForever, MdSave } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import createApi, {
  QualificationDto,
  PostGigDto,
  GigDto,
  WorkerDto,
  EditGigDto,
} from '../../api';
import { addDays, format, setSeconds } from 'date-fns';
import Selector from './Selector';

interface GigUpsertFormProps {
  qualifications: QualificationDto[];
  gigToEdit: GigDto | null;
  workers: WorkerDto[] | null;
}

export default function GigUpsertForm({
  gigToEdit,
  qualifications,
  workers,
}: GigUpsertFormProps) {
  const isPostMode = gigToEdit == null;
  const navigate = useNavigate();

  const now = setSeconds(new Date(), 0);

  const { postGig, editGig, deleteGig } = createApi();

  const [qualificationId, setQualificationId] = useState(
    gigToEdit?.qualification.id ?? qualifications[0].id
  );

  const [startDate, setStartDate] = useState<string>(
    gigToEdit != null
      ? format(new Date(gigToEdit.start), 'yyyy-MM-dd')
      : format(addDays(now, 1), 'yyyy-MM-dd')
  );

  const [startTime, setStartTime] = useState<string>(
    gigToEdit != null ? format(new Date(gigToEdit.start), 'HH:mm') : '07:00'
  );

  const [endTime, setEndTime] = useState<string>(
    gigToEdit != null ? format(new Date(gigToEdit.end), 'HH:mm') : '15:00'
  );

  const [address, setAddress] = useState(gigToEdit?.address ?? '');
  const [maxWorkers, setMaxWorkers] = useState(gigToEdit?.maxWorkers ?? 5);
  const [description, setDescription] = useState(gigToEdit?.description ?? '');

  const [workerIdsSelected, setWorkerIdsSelected] = useState<string[]>(
    gigToEdit?.workerIds ?? []
  );

  const [errorMessage, setErrorMessage] = useState('');

  const inputStartTimeRef = useRef<HTMLInputElement>(null);

  async function onDelete() {
    if (!gigToEdit) throw new Error();
    const result = await deleteGig(gigToEdit.id);

    if (!result.ok) {
      setErrorMessage(result.errorMessage);
      return;
    }

    navigate(-1);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrorMessage('');

    if (!inputStartTimeRef.current) throw new Error();

    inputStartTimeRef.current.setCustomValidity('');

    const start = new Date(`${startDate}T${startTime}`);

    if (isPostMode && start < now) {
      inputStartTimeRef.current.setCustomValidity(
        'Tämä ei voi olla menneisyydessä.'
      );
      return;
    }

    const endTemp = new Date(`${startDate}T${endTime}`);
    const end = endTemp < start ? addDays(endTemp, 1) : endTemp;

    const newGig = {
      start: start.toISOString(),
      end: end.toISOString(),
      address,
      maxWorkers,
      description,
    };

    const result =
      gigToEdit == null
        ? await postGig({
            qualificationId,
            ...newGig,
          } as PostGigDto)
        : await editGig(gigToEdit.id, {
            ...newGig,
            workerIds: workerIdsSelected,
          } as EditGigDto);

    if (!result.ok) {
      setErrorMessage(result.errorMessage);
      return;
    }

    navigate(-1);
  }

  return (
    <>
      <button
        type="button"
        className="mb-4 btn-secondary"
        onClick={() => navigate(-1)}
      >
        <MdArrowBack className="mr-1" />
        Takaisin
      </button>
      <form
        className="p-4 flex flex-col items-start rounded border"
        onSubmit={onSubmit}
      >
        <span className="mb-2 text-lg font-semibold">
          {isPostMode ? 'Julkaise keikka' : 'Muokkaa keikkaa'}
        </span>

        <label htmlFor="select-qualification">Pätevyys</label>
        <select
          id="select-qualification"
          required
          className="mb-2 p-1 rounded border border-secondary-300 bg-secondary-50"
          value={qualificationId}
          onChange={(e) => setQualificationId(e.target.value)}
          disabled={!isPostMode}
        >
          {qualifications.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>

        <label htmlFor="input-date">Päivämäärä</label>
        <input
          id="input-date"
          type="date"
          required
          className="mb-2"
          value={startDate}
          min={isPostMode ? format(now, 'yyyy-MM-dd') : undefined}
          onChange={(e) =>
            e.target.validity.valid && setStartDate(e.target.value)
          }
        />

        <label htmlFor="input-start-time">Aika</label>
        <div className="flex">
          <input
            ref={inputStartTimeRef}
            id="input-start-time"
            type="time"
            required
            className="mb-2 max-w-[6rem]"
            value={startTime}
            onChange={(e) =>
              e.target.validity.valid && setStartTime(e.target.value)
            }
          />
          <span className="mx-1">&mdash;</span>
          <input
            id="input-end"
            type="time"
            required
            className="mb-2 max-w-[6rem]"
            value={endTime}
            onChange={(e) =>
              e.target.validity.valid && setEndTime(e.target.value)
            }
          />
        </div>

        <label htmlFor="input-address">Osoite</label>
        <input
          id="input-address"
          type="text"
          required
          className="mb-2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label htmlFor="input-maxworkers">Maksimi määrä työntekijöitä</label>
        <input
          id="input-maxworkers"
          type="number"
          required
          min={1}
          step={1}
          className="mb-2"
          value={maxWorkers}
          onChange={(e) =>
            e.target.validity.valid && setMaxWorkers(parseInt(e.target.value))
          }
        />

        {workers && !isPostMode && (
          <Selector
            title={`Ilmoittautuneet työntekijät (${workerIdsSelected.length}/${maxWorkers})`}
            addTitle="Lisää työntekijä"
            noneTitle="Ei työntekijöitä"
            max={maxWorkers}
            options={workers
              .filter((w) =>
                w.qualifications.some(
                  (q) => q.id === gigToEdit.qualification.id
                )
              )
              .map((w) => ({
                id: w.id,
                name: w.name,
                href: `/manage/staff/${w.id}`,
              }))}
            selectedIds={workerIdsSelected}
            onChange={(newIds) => setWorkerIdsSelected(newIds)}
          />
        )}

        <label htmlFor="input-notes">Kuvaus</label>
        <textarea
          id="input-notes"
          className="mb-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <div className="mt-2 flex flex-col items-start ">
          <button type="submit" className="btn-primary">
            {isPostMode ? (
              <>
                <MdAdd className="mr-1" />
                <span className="px-1">Julkaise</span>
              </>
            ) : (
              <>
                <MdSave className="mr-1" />
                <span className="px-1">Tallenna</span>
              </>
            )}
          </button>

          {!isPostMode && (
            <button
              type="button"
              className="mt-2 btn-danger"
              onClick={onDelete}
            >
              <MdDeleteForever className="mr-1" />
              Poista
            </button>
          )}
        </div>

        {errorMessage.length > 0 && (
          <span className="mt-2 text-red-500">{errorMessage}</span>
        )}
      </form>
    </>
  );
}
