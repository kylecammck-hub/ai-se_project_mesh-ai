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

export interface User {
  userId: string;
  name: string;
  email: string;
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

const TOKEN_KEY = 'token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse<T>(res: Response): Promise<T> {
  const body: ApiResponse<T> = await res.json();

  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || 'Something went wrong');
  }

  return body.data;
}

// --- Auth ---

export function registerUser(email: string, password: string, name: string): Promise<User> {
  return fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  }).then((res) => parseResponse<User>(res));
}

export function loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then((res) => parseResponse<{ token: string; user: User }>(res));
}

export function getCurrentUser(): Promise<User> {
  return fetch(`${API_BASE_URL}/users/me`, {
    headers: getAuthHeaders(),
  }).then((res) => parseResponse<User>(res));
}

// --- Chats ---

export function getChats(): Promise<Chat[]> {
  return fetch(`${API_BASE_URL}/chats`, {
    headers: getAuthHeaders(),
  }).then((res) => parseResponse<Chat[]>(res));
}

export function createChat(title: string): Promise<Chat> {
  return fetch(`${API_BASE_URL}/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ title }),
  }).then((res) => parseResponse<Chat>(res));
}

export function getChat(chatId: string): Promise<{ chat: Chat; messages: Message[] }> {
  return fetch(`${API_BASE_URL}/chats/${chatId}`, {
    headers: getAuthHeaders(),
  }).then((res) => parseResponse<{ chat: Chat; messages: Message[] }>(res));
}

export function deleteChat(chatId: string): Promise<void> {
  return fetch(`${API_BASE_URL}/chats/${chatId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to delete chat');
    }
  });
}

// The server returns both the new user message and the assistant's reply;
// the Chat page already adds the user's own message optimistically, so only
// the assistant reply is handed back here.
export function sendMessage(chatId: string, question: string): Promise<Message> {
  return fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ question }),
  })
    .then((res) => parseResponse<Message[]>(res))
    .then((messages) => messages[messages.length - 1]);
}

// --- Documents ---

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
