import { CodeResponse } from '@react-oauth/google';
import { components } from '../../schema';
import { Result } from './result';

type LoginDto = components['schemas']['LoginDto'];
type LoginGoogleDto = components['schemas']['LoginGoogleDto'];

type RequestResetPasswordDto = components['schemas']['RequestResetPasswordDto'];
type ResetPasswordDto = components['schemas']['ResetPasswordDto'];

export type DoneGigDto = components['schemas']['DoneGigDto'];
export type UpcomingGigDto = components['schemas']['UpcomingGigDto'];
export type GigDto = components['schemas']['GigDto'];
export type PostGigDto = components['schemas']['PostGigDto'];
export type EditGigDto = components['schemas']['EditGigDto'];
export type QualificationDto = components['schemas']['QualificationDto'];
export type AddWorkerDto = components['schemas']['AddWorkerDto'];
export type WorkerDto = components['schemas']['WorkerDto'];
export type EditWorkerDto = components['schemas']['EditWorkerDto'];

export default function createApi() {
  async function requestApi<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data: unknown = undefined
  ): Promise<Result<T>> {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseText = await response.text();
        if (responseText.length > 0) {
          throw new Error(`Virhe: ${responseText}`);
        }

        throw new Error(
          `HTTP Error ${response.status} (${response.statusText})`
        );
      }

      // return nothing when status is No Content
      const value =
        response.status === 204
          ? (undefined as T)
          : ((await response.json()) as T);

      return { ok: true, value };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return {
        ok: false,
        errorMessage,
      };
    }
  }

  return {
    login: (email: string, password: string): Promise<Result> =>
      requestApi('POST', '/api/login', {
        email,
        password,
      } as LoginDto),
    loginWithGoogle: (codeResponse: CodeResponse): Promise<Result> =>
      requestApi('POST', '/api/login-google', codeResponse as LoginGoogleDto),

    requestResetPassword: (email: string): Promise<Result> =>
      requestApi('POST', '/api/request-reset-password', {
        email,
      } as RequestResetPasswordDto),
    resetPassword: (
      userId: string,
      token: string,
      newPassword: string
    ): Promise<Result> =>
      requestApi('POST', '/api/reset-password', {
        userId,
        token,
        newPassword,
      } as ResetPasswordDto),

    logout: (): Promise<Result> => requestApi('POST', '/api/logout'),

    signUp: (id: string): Promise<Result> =>
      requestApi('POST', `/api/gigs/${id}/signup`),
    cancelSignUp: (id: string): Promise<Result> =>
      requestApi('POST', `/api/gigs/${id}/signup-cancel`),

    postGig: (dto: PostGigDto): Promise<Result<GigDto>> =>
      requestApi('POST', '/api/gigs', dto),
    editGig: (id: string, dto: EditGigDto): Promise<Result<GigDto>> =>
      requestApi('PUT', `/api/gigs/${id}`, dto),
    deleteGig: (id: string): Promise<Result> =>
      requestApi('DELETE', `/api/gigs/${id}`),

    addWorker: (dto: AddWorkerDto) => requestApi('POST', '/api/workers', dto),
    editWorker: (
      workerId: string,
      dto: EditWorkerDto
    ): Promise<Result<WorkerDto>> =>
      requestApi('PUT', `/api/workers/${workerId}`, dto),
  };
}
