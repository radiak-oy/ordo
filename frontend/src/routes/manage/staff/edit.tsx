import { useLoaderData } from 'react-router-dom';
import { WorkerDto, QualificationDto } from '../../../api';
import ProfileUpsertForm from '../../../components/manage/StaffUpsertForm';

export default function Edit() {
  const { worker, qualifications } = useLoaderData() as {
    worker: WorkerDto;
    qualifications: QualificationDto[];
  };

  return (
    <ProfileUpsertForm qualifications={qualifications} workerToEdit={worker} />
  );
}
