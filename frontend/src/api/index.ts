import { components } from '../../schema';
import { Result } from './result';

export type LoginResponseDto = components['schemas']['LoginResponseDto'];
export type DoneGigDto = components['schemas']['DoneGigDto'];
export type UpcomingGigDto = components['schemas']['UpcomingGigDto'];
export type GigDto = components['schemas']['GigDto'];
export type PostGigDto = components['schemas']['PostGigDto'];
export type EditGigDto = components['schemas']['EditGigDto'];
export type QualificationDto = components['schemas']['QualificationDto'];
export type ProfileDto = components['schemas']['ProfileDto'];
export type EditProfileDto = components['schemas']['EditProfileDto'];

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
    login: (
      username: string,
      password: string
    ): Promise<Result<LoginResponseDto>> =>
      requestApi('POST', '/api/login', { username, password }),
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

    editProfile: (
      workerId: string,
      dto: EditProfileDto
    ): Promise<Result<ProfileDto>> =>
      requestApi('PUT', `/api/profiles/${workerId}`, dto),
  };
}
