import { useState, useEffect } from 'react';
import { getChats, createChat, Chat as ChatType } from '../../utils/api';
import './Chat.css';

export default function Chat() {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const [newChatTitle, setNewChatTitle] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    getChats()
      .then((data) => {
        if (isMounted) {
          setChats(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setChatsError(err instanceof Error ? err.message : 'Failed to load chats');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingChats(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="chat">
      <aside className="chat__sidebar">
        <button className="chat__new-btn" type="button">
          + New Chat
        </button>

        {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
        {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

        <ul className="chat__list">
          {/* chats are rendered here in the next step */}
        </ul>
      </aside>

      <div className="chat__main">{/* message area — coming next lesson */}</div>
    </div>
  );
}
