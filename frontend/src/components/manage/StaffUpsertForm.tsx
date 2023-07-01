import { useState } from 'react';
import createApi, {
  CreateProfileDto,
  EditProfileDto,
  ProfileDto,
  QualificationDto,
} from '../../api';
import { MdAdd, MdArrowBack, MdSave } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Selector from './Selector';

interface ProfileUpsertFormProps {
  qualifications: QualificationDto[];
  profileToEdit: ProfileDto | null;
}

export default function ProfileUpsertForm({
  qualifications,
  profileToEdit,
}: ProfileUpsertFormProps) {
  const isCreateMode = profileToEdit == null;
  const navigate = useNavigate();
  const { createProfile, editProfile } = createApi();

  const [email, setEmail] = useState('');
  const [name, setName] = useState(profileToEdit?.name ?? '');
  const [qualificationIdsSelected, setQualificationIdsSelected] = useState<
    string[]
  >(profileToEdit?.qualifications.map((q) => q.id) ?? []);
  const [notes, setNotes] = useState(profileToEdit?.notes ?? '');

  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result =
      profileToEdit != null
        ? await editProfile(profileToEdit.workerId, {
            name,
            qualificationIds: qualificationIdsSelected,
            notes,
          } as EditProfileDto)
        : await createProfile({
            email,
            name,
            qualificationIds: qualificationIdsSelected,
            notes,
          } as CreateProfileDto);

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

        <button type="submit" className="mt-2 btn-primary">
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

        <span className="text-red-500">{errorMessage}</span>
      </form>
    </>
  );
}
