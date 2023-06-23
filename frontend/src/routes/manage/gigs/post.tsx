import { useLoaderData } from 'react-router-dom';
import GigUpsertForm from '../../../components/manage/GigUpsertForm';
import { QualificationDto } from '../../../api';

export default function Post() {
  const qualifications = useLoaderData() as QualificationDto[];

  return (
    <GigUpsertForm
      gigToEdit={null}
      profiles={null}
      qualifications={qualifications}
    />
  );
}
