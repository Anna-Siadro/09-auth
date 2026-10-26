import { api } from './api';
import type { Note, NewNote } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username: string;
}

interface CheckSessionResponse {
  success: boolean;
}

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
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const register = async (body: AuthRequest): Promise<User> => {
  const { data } = await api.post<User>('/auth/register', body);
  return data;
};

export const login = async (body: AuthRequest): Promise<User> => {
  const { data } = await api.post<User>('/auth/login', body);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<boolean> => {
  const { data } = await api.get<CheckSessionResponse>('/auth/session');
  return data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateMe = async (body: UpdateUserRequest): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', body);
  return data;
};
