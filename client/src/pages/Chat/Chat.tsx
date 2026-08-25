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

  return <div className="chat">Chat</div>;
}
