import { useState, useEffect } from 'react';
import { getChats, createChat, getChat, Chat as ChatType, Message } from '../../utils/api';
import './Chat.css';

export default function Chat() {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const [newChatTitle, setNewChatTitle] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string>('');

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

  useEffect(() => {
    if (!activeChatId) {
      return;
    }

    const load = async () => {
      setMessages([]);
      setMessagesError('');
      setIsLoadingMessages(true);
      try {
        const res = await getChat(activeChatId);
        setMessages(res.messages || []);
      } catch {
        setMessagesError('Failed to load messages');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    load();
  }, [activeChatId]);

  function getChatItemClass(chatId: string) {
    return `chat__item${chatId === activeChatId ? ' chat__item_active' : ''}`;
  }

  return (
    <div className="chat">
      <aside className="chat__sidebar">
        <button className="chat__new-btn" type="button">
          + New Chat
        </button>

        {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
        {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

        <ul className="chat__list">
          {chats.map((chat) => (
            <li key={chat._id}>
              <button
                type="button"
                className={getChatItemClass(chat._id)}
                onClick={() => setActiveChatId(chat._id)}
              >
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="chat__main">
        {!messagesError && !isLoadingMessages && !activeChatId && (
          <div className="chat__no-messages">
            <p>Create a new chat or select an existing chat to start the conversation</p>
            <button type="button" className="chat__cta-btn">
              Start New Chat
            </button>
          </div>
        )}

        {!messagesError && !isLoadingMessages && activeChatId && messages.length === 0 && (
          <div className="chat__no-messages">
            <p>Ask a question below to start the conversation</p>
          </div>
        )}

        {activeChatId && isLoadingMessages && (
          <p className="chat__no-messages">Loading…</p>
        )}

        {activeChatId && messagesError && (
          <div className="chat__error">
            <div className="chat__error-icon" aria-hidden="true">
              ⚠️
            </div>
            <h2 className="chat__error-title">Looks like something went wrong</h2>
            <p className="chat__error-text">Try reloading the page or creating the chat again</p>
            <button type="button" className="chat__cta-btn">
              Go to the Main Page
            </button>
          </div>
        )}

        {activeChatId && !isLoadingMessages && !messagesError && (
            <>
              <ul className="chat__messages">
                {messages.map((message) => (
                  <li
                    key={message._id}
                    className={`chat__message${message.role === 'user' ? ' chat__message_user' : ''}`}
                  >
                    <p className="chat__message-text">{message.content}</p>
                  </li>
                ))}
              </ul>

              <div className="chat__input-bar">
                <textarea
                  className="chat__input"
                  placeholder="Ask any question"
                  rows={1}
                />
                <button
                  className="chat__send"
                  aria-label="Send message"
                ></button>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
