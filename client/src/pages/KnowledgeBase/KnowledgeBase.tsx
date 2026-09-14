import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { getDocuments, uploadDocument, deleteDocument, type Document } from '../../utils/api';
import './KnowledgeBase.css';

// A file the user has picked/dropped but not yet saved to the server.
type PendingFile = {
  id: string;
  file: File;
};

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    getDocuments()
      .then((data) => {
        if (isMounted) {
          setDocuments(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadError('Failed to load documents.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function addFiles(fileList: FileList | File[]) {
    const pdfFiles = Array.from(fileList).filter((file) => file.type === 'application/pdf');

    if (pdfFiles.length === 0) {
      return;
    }

    setPendingFiles((prev) => [
      ...prev,
      ...pdfFiles.map((file) => ({ id: `${file.name}-${file.lastModified}-${Date.now()}`, file })),
    ]);
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      addFiles(event.target.files);
    }
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(false);
    if (event.dataTransfer.files) {
      addFiles(event.dataTransfer.files);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(true);
  }

  function handleDragLeave() {
    setIsDragActive(false);
  }

  function handleRemovePending(id: string) {
    setPendingFiles((prev) => prev.filter((pending) => pending.id !== id));
  }

  async function handleRemoveDocument(documentId: string) {
    const previous = documents;
    setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));

    try {
      await deleteDocument(documentId);
    } catch {
      setDocuments(previous);
    }
  }

  async function handleSave() {
    if (pendingFiles.length === 0 || isSaving) {
      return;
    }

    setIsSaving(true);

    const results = await Promise.allSettled(
      pendingFiles.map(({ file }) => uploadDocument(file))
    );

    const uploaded: Document[] = [];
    const stillPending: PendingFile[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        uploaded.push(result.value);
      } else {
        stillPending.push(pendingFiles[index]);
      }
    });

    setDocuments((prev) => [...prev, ...uploaded]);
    setPendingFiles(stillPending);
    setIsSaving(false);
  }

  const hasNoDocuments =
    !isLoading && !loadError && documents.length === 0 && pendingFiles.length === 0;

  return (
    <section className="knowledge">
      <h1 className="knowledge__title">Manage Your Knowledge Base</h1>

      <div className="knowledge__section">
        <p className="knowledge__label">Upload documents (PDF)</p>

        <div
          className={`knowledge__dropzone${isDragActive ? ' knowledge__dropzone_active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <svg
            className="knowledge__dropzone-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 18a4 4 0 0 1-.6-7.96A5 5 0 0 1 16.9 8.1 4.5 4.5 0 0 1 17.5 17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 20v-7m0 0-2.5 2.5M12 13l2.5 2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="knowledge__dropzone-text">
            Drag&apos;n&apos;Drop or{' '}
            <button type="button" className="knowledge__upload-link" onClick={handleUploadClick}>
              Upload
            </button>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="knowledge__file-input"
            onChange={handleFileInputChange}
          />
        </div>

        {isLoading && <p className="knowledge__status">Loading…</p>}
        {loadError && <p className="knowledge__status knowledge__status_error">{loadError}</p>}
        {hasNoDocuments && <p className="knowledge__status">No documents yet.</p>}

        {(documents.length > 0 || pendingFiles.length > 0) && (
          <ul className="knowledge__file-list">
            {documents.map((doc) => (
              <li className="knowledge__chip" key={doc._id}>
                <span className="knowledge__chip-name">{doc.title}</span>
                <button
                  type="button"
                  className="knowledge__chip-remove"
                  aria-label={`Remove ${doc.title}`}
                  onClick={() => handleRemoveDocument(doc._id)}
                >
                  ×
                </button>
              </li>
            ))}
            {pendingFiles.map(({ id, file }) => (
              <li className="knowledge__chip knowledge__chip_pending" key={id}>
                <span className="knowledge__chip-name">{file.name}</span>
                <button
                  type="button"
                  className="knowledge__chip-remove"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => handleRemovePending(id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className="knowledge__save-btn"
          onClick={handleSave}
          disabled={pendingFiles.length === 0 || isSaving}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </section>
  );
}
