import { useLoaderData } from 'react-router-dom';
import WorkerUpsertForm from '../../../components/manage/WorkerUpsertForm';
import { QualificationDto } from '../../../api';

export default function Add() {
  const qualifications = useLoaderData() as QualificationDto[];

  return (
    <WorkerUpsertForm qualifications={qualifications} workerToEdit={null} />
  );
}
