export interface Chat {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Document {
  _id: string;
  title: string;
  fileName: string;
  userId: string;
  createdAt: string;
}

interface ApiError {
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: ApiError | null;
}

// The server doesn't run on the same origin as the Vite dev server, so point
// requests at it directly. Override with VITE_API_URL for other environments.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse<T>(res: Response): Promise<T> {
  const body: ApiResponse<T> = await res.json();

  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || 'Something went wrong');
  }

  return body.data;
}

// Note: chats/messages are intentionally NOT fetched from this API — see
// utils/chatsStub.ts, which the Chat page reads from instead.

export function getDocuments(): Promise<Document[]> {
  return fetch(`${API_BASE_URL}/documents`, {
    headers: getAuthHeaders(),
  }).then((res) => parseResponse<Document[]>(res));
}

export function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);

  return fetch(`${API_BASE_URL}/documents`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  }).then((res) => parseResponse<Document>(res));
}

export function deleteDocument(documentId: string): Promise<void> {
  return fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to delete document');
    }
  });
}

