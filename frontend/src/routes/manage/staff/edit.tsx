import { useLoaderData } from 'react-router-dom';
import { ProfileDto, QualificationDto } from '../../../api';
import ProfileUpsertForm from '../../../components/manage/StaffUpsertForm';

export default function Edit() {
  const { profile, qualifications } = useLoaderData() as {
    profile: ProfileDto;
    qualifications: QualificationDto[];
  };

  return (
    <ProfileUpsertForm
      qualifications={qualifications}
      profileToEdit={profile}
    />
  );
}
