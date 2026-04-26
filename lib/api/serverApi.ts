import { cookies } from "next/headers";
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

interface SessionResponse {
  success: boolean;
}

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
  const cookie = await getCookieHeader();
  const { tag, ...rest } = params;
  const q: Record<string, string | number | undefined> = { ...rest };
  if (tag && tag !== "all") q.tag = tag;
  const { data } = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params: q,
    headers: { cookie },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookie = await getCookieHeader();
  const { data } = await axiosInstance.get<Note>(`/notes/${id}`, {
    headers: { cookie },
  });
  return data;
}

export async function getMe(): Promise<User> {
  const cookie = await getCookieHeader();
  const { data } = await axiosInstance.get<User>("/users/me", {
    headers: { cookie },
  });
  return data;
}

export async function checkSession(): Promise<SessionResponse> {
  const cookie = await getCookieHeader();
  const { data } = await axiosInstance.get<SessionResponse>("/auth/session", {
    headers: { cookie },
  });
  return data;
}
