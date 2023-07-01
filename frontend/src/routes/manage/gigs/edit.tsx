import { useLoaderData } from 'react-router-dom';
import { GigDto, WorkerDto, QualificationDto } from '../../../api';
import GigUpsertForm from '../../../components/manage/GigUpsertForm';

export default function Edit() {
  const { gig, qualifications, workers } = useLoaderData() as {
    gig: GigDto;
    qualifications: QualificationDto[];
    workers: WorkerDto[];
  };

  return (
    <GigUpsertForm
      gigToEdit={gig}
      qualifications={qualifications}
      workers={workers}
    />
  );
}
