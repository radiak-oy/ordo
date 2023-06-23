import { useLoaderData } from 'react-router-dom';
import { GigDto, ProfileDto, QualificationDto } from '../../../api';
import GigUpsertForm from '../../../components/manage/GigUpsertForm';

export default function Edit() {
  const { gig, qualifications, profiles } = useLoaderData() as {
    gig: GigDto;
    qualifications: QualificationDto[];
    profiles: ProfileDto[];
  };

  return (
    <GigUpsertForm
      gigToEdit={gig}
      qualifications={qualifications}
      profiles={profiles}
    />
  );
}
