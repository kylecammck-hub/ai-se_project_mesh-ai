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

export function getChats(): Promise<Chat[]> {
  return fetch(`${API_BASE_URL}/chats`, {
    headers: getAuthHeaders(),
  }).then((res) => parseResponse<Chat[]>(res));
}

export function createChat(title: string): Promise<Chat> {
  return fetch(`${API_BASE_URL}/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title }),
  }).then((res) => parseResponse<Chat>(res));
}

export function getChat(chatId: string): Promise<{ chat: Chat; messages: Message[] }> {
  return fetch(`${API_BASE_URL}/chats/${chatId}`, {
    headers: getAuthHeaders(),
  }).then((res) => parseResponse<{ chat: Chat; messages: Message[] }>(res));
}

