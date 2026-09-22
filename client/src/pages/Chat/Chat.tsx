import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getChats, createChat, getChat, sendMessage } from '../../utils/api';
import type { Chat as ChatType, Message } from '../../utils/api';
import ReactMarkdown from 'react-markdown';
import { useFormWithValidation, type Validators } from '../../hooks/useFormWithValidation';
import './Chat.css';

type NewChatValues = {
  title: string;
};

const CHAT_TITLE_MAX_LENGTH = 60;

const newChatInitialValues: NewChatValues = { title: '' };

const newChatValidators: Validators<NewChatValues> = {
  title: (value) => {
    if (!value.trim()) return 'Chat name is required';
    if (value.trim().length > CHAT_TITLE_MAX_LENGTH) {
      return `Chat name must be ${CHAT_TITLE_MAX_LENGTH} characters or fewer`;
    }
    return '';
  },
};

type MobileContext = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
};

export default function Chat() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useOutletContext<MobileContext>();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const {
    values: newChatValues,
    errors: newChatErrors,
    isValid: isNewChatValid,
    handleChange: handleNewChatChange,
    resetForm: resetNewChatForm,
  } = useFormWithValidation(newChatInitialValues, newChatValidators);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

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

  const handleCreateChat = async () => {
    if (!isNewChatValid) return;
    const title = newChatValues.title.trim();

    try {
      const chat = await createChat(title);
      setChats((prev) => [...prev, chat]);
      setActiveChatId(chat._id);
      setIsMobileMenuOpen(false);
    } catch {
      setChatsError('Failed to create chat');
    } finally {
      setIsCreatingChat(false);
      resetNewChatForm();
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeChatId || isSending) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      chatId: activeChatId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const res = await sendMessage(activeChatId, text);
      if (res) {
        setMessages((prev) => [...prev, res]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          chatId: activeChatId,
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat">
      <aside
        className={`chat__sidebar${
          isMobileMenuOpen ? ' chat__sidebar_open' : ''
        }`}
      >
        {isCreatingChat ? (
          <form
            className="chat__new-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateChat();
            }}
            noValidate
          >
            <input
              type="text"
              name="title"
              className={`chat__new-chat-input${
                newChatErrors.title ? ' chat__new-chat-input_invalid' : ''
              }`}
              placeholder="Chat name"
              value={newChatValues.title}
              onChange={handleNewChatChange}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsCreatingChat(false);
                  resetNewChatForm();
                }
              }}
              aria-invalid={Boolean(newChatErrors.title)}
              required
              autoFocus
            />
            {newChatErrors.title && (
              <span className="chat__new-chat-error">{newChatErrors.title}</span>
            )}
            <button
              type="submit"
              className="chat__new-chat-submit"
              disabled={!isNewChatValid}
            >
              Create
            </button>
          </form>
        ) : (
          <button
            className="chat__new-btn"
            type="button"
            onClick={() => setIsCreatingChat(true)}
          >
            + New Chat
          </button>
        )}

        {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
        {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

        <ul className="chat__list">
          {chats.map((chat) => (
            <li key={chat._id}>
              <button
                type="button"
                className={getChatItemClass(chat._id)}
                onClick={() => {
                  setActiveChatId(chat._id);
                  setIsMobileMenuOpen(false);
                }}
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
            <button
              type="button"
              className="chat__cta-btn"
              onClick={() => {
                setIsCreatingChat(true);
                setIsMobileMenuOpen(true);
              }}
            >
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
<div className="chat__message-text"><ReactMarkdown>{message.content}</ReactMarkdown></div>
                </li>
              ))}
              {isSending && (
                <li className="chat__message chat__message_thinking">
                  <div className="chat__message-text">Thinking…</div>
                </li>
              )}
            </ul>

            <div className="chat__input-bar">
              <textarea
                className="chat__input"
                placeholder="Ask any question"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                className="chat__send"
                aria-label="Send message"
                onClick={handleSend}
                disabled={isSending || !input.trim()}
              ></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
