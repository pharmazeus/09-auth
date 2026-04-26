import { axiosInstance } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
}

interface AuthData {
  email: string;
  password: string;
}

interface SessionResponse {
  success: boolean;
}

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
  const { tag, ...rest } = params;
  const q: Record<string, string | number | undefined> = { ...rest };
  if (tag && tag !== "all") q.tag = tag;
  const { data } = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params: q,
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await axiosInstance.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(
  note: Pick<Note, "title" | "content" | "tag">,
): Promise<Note> {
  const { data } = await axiosInstance.post<Note>("/notes", note);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await axiosInstance.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(payload: AuthData): Promise<User> {
  const { data } = await axiosInstance.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: AuthData): Promise<User> {
  const { data } = await axiosInstance.post<User>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}

export async function checkSession(): Promise<SessionResponse> {
  const { data } = await axiosInstance.get<SessionResponse>("/auth/session");
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await axiosInstance.get<User>("/users/me");
  return data;
}

export async function updateMe(
  payload: Partial<Pick<User, "username">>,
): Promise<User> {
  const { data } = await axiosInstance.patch<User>("/users/me", payload);
  return data;
}
