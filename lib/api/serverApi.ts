import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import type { FetchNotesParams, FetchNotesResponse } from './clientApi';

interface CheckSessionResponse {
  success: boolean;
}

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

export const fetchNotes = async ({
  search = '',
  page = 1,
  perPage = 12,
  tag,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
    headers: await getCookieHeader(),
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: await getCookieHeader(),
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me', {
    headers: await getCookieHeader(),
  });
  return data;
};

export const checkSession = async (): Promise<AxiosResponse<CheckSessionResponse>> => {
  return api.get<CheckSessionResponse>('/auth/session', {
    headers: await getCookieHeader(),
  });
};
