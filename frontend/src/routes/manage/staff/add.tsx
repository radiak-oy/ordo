import { useLoaderData } from 'react-router-dom';
import ProfileUpsertForm from '../../../components/manage/StaffUpsertForm';
import { QualificationDto } from '../../../api';

export default function Add() {
  const qualifications = useLoaderData() as QualificationDto[];

  return (
    <ProfileUpsertForm qualifications={qualifications} profileToEdit={null} />
  );
}
