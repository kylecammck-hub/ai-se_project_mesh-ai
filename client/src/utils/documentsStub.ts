// Documents for this page are intentionally NOT fetched from the server.
// The Knowledge Base upload/delete endpoints are outside the scope of
// this project - instead we read from (and mutate) this in-memory stub
// so the UI can be built and exercised without a backend.
import type { Document } from './api';

const STUB_USER_ID = 'user_stub_001';

let documents: Document[] = [
  {
    _id: 'doc_1',
    title: 'Employee Handbook',
    fileName: 'employee-handbook.pdf',
    userId: STUB_USER_ID,
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    _id: 'doc_2',
    title: 'Vacation Policy',
    fileName: 'vacation-policy.pdf',
    userId: STUB_USER_ID,
    createdAt: '2026-08-18T09:30:00.000Z',
  },
  ];

let nextId = 3;

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function getDocuments(): Promise<Document[]> {
  return delay([...documents]);
}

export function uploadDocument(file: File): Promise<Document> {
  const doc: Document = {
    _id: 'doc_' + nextId++,
    title: file.name.replace(/\.pdf$/i, ''),
    fileName: file.name,
    userId: STUB_USER_ID,
    createdAt: new Date().toISOString(),
  };

documents = [...documents, doc];

return delay(doc);
}

export function deleteDocument(documentId: string): Promise<void> {
  documents = documents.filter((doc) => doc._id !== documentId);
  return delay(undefined);
}
