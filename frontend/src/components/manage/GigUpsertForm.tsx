import { useState } from 'react';
import { MdAdd, MdArrowBack, MdDeleteForever, MdSave } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import createApi, {
  QualificationDto,
  PostGigDto,
  GigDto,
  WorkerDto,
  EditGigDto,
} from '../../api';
import { addDays, addHours, format, setHours, setMinutes } from 'date-fns';
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

  const { postGig, editGig, deleteGig } = createApi();

  const [qualificationId, setQualificationId] = useState(
    gigToEdit?.qualification.id ?? qualifications[0].id
  );

  const [startDateTime, setStartDateTime] = useState<Date>(
    gigToEdit != null
      ? new Date(gigToEdit.start)
      : addDays(setHours(setMinutes(new Date(), 0), 7), 1)
  );

  const [endDateTime, setEndDateTime] = useState<Date>(
    gigToEdit != null
      ? new Date(gigToEdit.end)
      : addHours(new Date(startDateTime), 8)
  );

  const [address, setAddress] = useState(gigToEdit?.address ?? '');
  const [maxWorkers, setMaxWorkers] = useState(gigToEdit?.maxWorkers ?? 5);

  const [workerIdsSelected, setWorkerIdsSelected] = useState<string[]>(
    gigToEdit?.workerIds ?? []
  );

  const [errorMessage, setErrorMessage] = useState('');

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

    const newGig = {
      start: new Date(startDateTime).toISOString(),
      end: new Date(endDateTime).toISOString(),
      address,
      maxWorkers,
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

        <label htmlFor="input-start">Alkaa</label>
        <input
          id="input-start"
          type="datetime-local"
          required
          className="mb-2"
          value={format(startDateTime, "yyyy-MM-dd'T'HH:mm")}
          onChange={(e) =>
            e.target.validity.valid &&
            setStartDateTime(new Date(e.target.value))
          }
          min={isPostMode ? new Date().toISOString().slice(0, -8) : undefined}
        />

        <label htmlFor="input-end">Päättyy</label>
        <input
          id="input-end"
          type="datetime-local"
          required
          className="mb-2"
          value={format(endDateTime, "yyyy-MM-dd'T'HH:mm")}
          onChange={(e) =>
            e.target.validity.valid && setEndDateTime(new Date(e.target.value))
          }
          min={
            isPostMode ? format(startDateTime, "yyyy-MM-dd'T'HH:mm") : undefined
          }
        />

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
              }))}
            selectedIds={workerIdsSelected}
            onChange={(newIds) => setWorkerIdsSelected(newIds)}
          />
        )}

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
