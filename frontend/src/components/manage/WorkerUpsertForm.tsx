import { useState } from 'react';
import createApi, {
  AddWorkerDto,
  EditWorkerDto,
  WorkerDto,
  QualificationDto,
} from '../../api';
import { MdAdd, MdSave } from 'react-icons/md';
import Selector from './Selector';

interface WorkerUpsertFormProps {
  qualifications: QualificationDto[];
  workerToEdit: WorkerDto | null;
}

export default function WorkerUpsertForm({
  qualifications,
  workerToEdit,
}: WorkerUpsertFormProps) {
  const isCreateMode = workerToEdit == null;
  const { addWorker, editWorker } = createApi();

  const [email, setEmail] = useState('');
  const [name, setName] = useState(workerToEdit?.name ?? '');
  const [qualificationIdsSelected, setQualificationIdsSelected] = useState<
    string[]
  >(workerToEdit?.qualifications.map((q) => q.id) ?? []);
  const [notes, setNotes] = useState(workerToEdit?.notes ?? '');

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    const result =
      workerToEdit != null
        ? await editWorker(workerToEdit.id, {
            name,
            qualificationIds: qualificationIdsSelected,
            notes,
          } as EditWorkerDto)
        : await addWorker({
            email,
            name,
            qualificationIds: qualificationIdsSelected,
            notes,
          } as AddWorkerDto);

    setIsLoading(false);

    if (!result.ok) {
      setErrorMessage(result.errorMessage);
    }
  }

  return (
    <form
      className="p-4 flex flex-col items-start rounded border"
      onSubmit={onSubmit}
    >
      <span className="mb-2 text-lg font-semibold">
        {isCreateMode ? 'Lisää henkilö' : `Muokkaa henkilöä ${name}`}
      </span>

      {isCreateMode && (
        <>
          <label htmlFor="input-email">Sähköpostiosoite</label>
          <input
            id="input-email"
            type="email"
            required
            className=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="mt-1 mb-2 text-secondary-700">
            Varmista sähköpostiosoitteen oikeinkirjoitus.
          </span>
        </>
      )}

      <label htmlFor="input-name">Nimi</label>
      <input
        id="input-name"
        type="text"
        required
        className="mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Selector
        title="Pätevyydet"
        noneTitle="Ei pätevyyksiä."
        addTitle="Lisää pätevyys"
        options={qualifications}
        selectedIds={qualificationIdsSelected}
        onChange={(newIds) => setQualificationIdsSelected(newIds)}
      />

      <label htmlFor="input-notes">Muistiinpanot</label>
      <textarea
        id="input-notes"
        className="mb-2 w-full"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {isCreateMode && (
        <>
          <span className="mb-1 text-secondary-700">
            Kun lisäät henkilön, hän saa linkin sähköpostiosoitteeseensa, jonka
            kautta hän voi luoda itselleen salasanan.
          </span>
          <span className="text-secondary-700">
            Jatkossa hän voi kirjautua tällä salasanalla (tai Googlen kautta,
            jos sähköpostiosoite on Google-tilin osoite).
          </span>
        </>
      )}

      <button type="submit" className="mt-2 btn-primary" disabled={isLoading}>
        {isCreateMode ? (
          <>
            <MdAdd className="mr-1" />
            <span className="pr-2">Lisää</span>
          </>
        ) : (
          <>
            <MdSave className="mr-1" />
            <span className="px-1">Tallenna</span>
          </>
        )}
      </button>

      {errorMessage.length > 0 && (
        <span className="mt-2 text-red-500">{errorMessage}</span>
      )}
    </form>
  );
}
