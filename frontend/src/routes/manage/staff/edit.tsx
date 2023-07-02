import { useLoaderData } from 'react-router-dom';
import { WorkerDto, QualificationDto } from '../../../api';
import WorkerUpsertForm from '../../../components/manage/WorkerUpsertForm';

export default function Edit() {
  const { worker, qualifications } = useLoaderData() as {
    worker: WorkerDto;
    qualifications: QualificationDto[];
  };

  return (
    <WorkerUpsertForm qualifications={qualifications} workerToEdit={worker} />
  );
}
