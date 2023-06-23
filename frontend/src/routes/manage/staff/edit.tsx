import { useLoaderData, useNavigate } from 'react-router-dom';
import createApi, {
  EditProfileDto,
  ProfileDto,
  QualificationDto,
} from '../../../api';
import { MdArrowBack, MdSave } from 'react-icons/md';
import { useState } from 'react';
import Selector from '../../../components/manage/Selector';

export default function Edit() {
  const navigate = useNavigate();

  const { editProfile } = createApi();

  const { profile, qualifications } = useLoaderData() as {
    profile: ProfileDto;
    qualifications: QualificationDto[];
  };

  const [name, setName] = useState(profile.name);
  const [qualificationIdsSelected, setQualificationIdsSelected] = useState(
    profile.qualifications.map((q) => q.id)
  );
  const [notes, setNotes] = useState(profile.notes);

  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await editProfile(profile.workerId, {
      name,
      qualificationIds: qualificationIdsSelected,
      notes,
    } as EditProfileDto);

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
          Muokkaa henkilöä {name}
        </span>

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
          <MdSave className="mr-1" />
          <span className="px-1">Tallenna</span>
        </button>

        <span className="text-red-500">{errorMessage}</span>
      </form>
    </>
  );
}
