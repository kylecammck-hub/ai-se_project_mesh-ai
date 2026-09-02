// Chat data for this page is intentionally NOT fetched from the server.
// Wiring the Chats page up to real chat/message endpoints is outside the
// scope of this project — instead we read from (and mutate) this in-memory
// stub so the UI can be built and exercised without a backend.
import type { Chat, Message } from './api';

const STUB_USER_ID = 'user_stub_001';

interface StubMessage extends Message {
  chatId: string;
}

let chats: Chat[] = [
  {
    _id: 'chat_1',
    title: 'Employee handbook questions',
    userId: STUB_USER_ID,
    createdAt: '2026-08-20T09:00:00.000Z',
  },
  {
    _id: 'chat_2',
    title: 'Vacation policy',
    userId: STUB_USER_ID,
    createdAt: '2026-08-24T14:30:00.000Z',
  },
  {
    _id: 'chat_3',
    title: 'Onboarding checklist',
    userId: STUB_USER_ID,
    createdAt: '2026-08-27T11:15:00.000Z',
  },
];

const messagesByChatId: Record<string, StubMessage[]> = {
  chat_1: [
    {
      _id: 'msg_1',
      chatId: 'chat_1',
      role: 'user',
      content: 'What is our policy on remote work?',
      createdAt: '2026-08-20T09:00:05.000Z',
    },
    {
      _id: 'msg_2',
      chatId: 'chat_1',
      role: 'assistant',
      content:
        'According to the employee handbook, remote work is available for eligible roles subject to manager approval. Employees are expected to be reachable during core hours, 10am-4pm local time.',
      createdAt: '2026-08-20T09:00:07.000Z',
    },
  ],
  chat_2: [
    {
      _id: 'msg_3',
      chatId: 'chat_2',
      role: 'user',
      content: 'How many vacation days do I get per year?',
      createdAt: '2026-08-24T14:30:05.000Z',
    },
    {
      _id: 'msg_4',
      chatId: 'chat_2',
      role: 'assistant',
      content:
        'Full-time employees accrue 15 vacation days per year, increasing to 20 days after three years of tenure. Unused days can roll over up to a maximum of 5 days.',
      createdAt: '2026-08-24T14:30:08.000Z',
    },
  ],
  chat_3: [],
};

let nextId = 4;

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function getChats(): Promise<Chat[]> {
  return delay([...chats]);
}

export function createChat(title: string): Promise<Chat> {
  const chat: Chat = {
    _id: `chat_${nextId++}`,
    title,
    userId: STUB_USER_ID,
    createdAt: new Date().toISOString(),
  };

  chats = [...chats, chat];
  messagesByChatId[chat._id] = [];

  return delay(chat);
}

export function getChat(chatId: string): Promise<{ chat: Chat; messages: Message[] }> {
  const chat = chats.find((c) => c._id === chatId);

  if (!chat) {
    return Promise.reject(new Error('chat not found'));
  }

  return delay({ chat, messages: messagesByChatId[chatId] ?? [] });
}

export function sendMessage(chatId: string, question: string): Promise<Message> {
  const chat = chats.find((c) => c._id === chatId);

  if (!chat) {
    return Promise.reject(new Error('chat not found'));
  }

  const userMessage: StubMessage = {
    _id: `msg_${nextId++}`,
    chatId,
    role: 'user',
    content: question,
    createdAt: new Date().toISOString(),
  };

  const assistantMessage: StubMessage = {
    _id: `msg_${nextId++}`,
    chatId,
    role: 'assistant',
    content:
      "This is stub data, so I can't look anything up yet — once the Knowledge Base is connected I'll answer using your documents.",
    createdAt: new Date().toISOString(),
  };

  messagesByChatId[chatId] = [...(messagesByChatId[chatId] ?? []), userMessage, assistantMessage];

  return delay(assistantMessage);
}
