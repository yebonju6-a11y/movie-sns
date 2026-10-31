import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Users,
  Film,
  Sparkles,
  Bot,
  Circle,
  Briefcase,
} from 'lucide-react';
import { ChatRoom, ChatMessage } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: ChatRoom[];
  messagesRecord: Record<string, ChatMessage[]>;
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onSendMessage: (roomId: string, text: string) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  rooms,
  messagesRecord,
  activeRoomId,
  onSelectRoom,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'group'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];
  const currentMessages = currentRoom ? messagesRecord[currentRoom.id] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, activeRoomId, currentMessages]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentRoom) return;

    const userText = inputText.trim();
    setInputText('');
    onSendMessage(currentRoom.id, userText);

    // If it's a live group chat or recruiter DM, trigger realistic response
    setTimeout(async () => {
      try {
        const res = await fetch('/api/chat/cinephile-bot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName: currentRoom.title,
            userMessage: userText,
          }),
        });
        const data = await res.json();
        if (data.success && data.reply) {
          onSendMessage(
            currentRoom.id,
            data.reply
          );
        }
      } catch (err) {
        console.warn('Bot reply fallback:', err);
      }
    }, 1200);
  };

  const filteredRooms = rooms.filter((r) => {
    if (activeTab === 'direct') return r.type === 'direct';
    if (activeTab === 'group') return r.type === 'group';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111118] border-l border-zinc-800 w-full max-w-2xl h-full flex flex-col md:flex-row shadow-2xl overflow-hidden">
        {/* Left Side (Room List) */}
        <div className="w-full md:w-72 bg-[#0d0d14] border-r border-zinc-800/80 flex flex-col shrink-0">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-bold text-white">시네마 실시간 대화</h2>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Filter for Rooms */}
          <div className="flex items-center border-b border-zinc-800/60 p-2 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                activeTab === 'group'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              오픈살롱
            </button>
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                activeTab === 'direct'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1:1 문의
            </button>
          </div>

          {/* Rooms List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/80">
            {filteredRooms.map((room) => {
              const isActive = room.id === activeRoomId;
              return (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`p-3 cursor-pointer flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-red-950/30 border-l-2 border-red-500'
                      : 'hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={room.avatar}
                      alt={room.title}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
                    />
                    {room.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0d0d14]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-semibold text-zinc-200 truncate">
                        {room.title}
                      </h4>
                      <span className="text-[10px] text-zinc-500 shrink-0">
                        {room.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {room.lastMessage}
                    </p>
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side (Active Chat View) */}
        <div className="flex-1 flex flex-col h-full bg-[#111118]">
          {/* Room Header */}
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-[#14141e]">
            <div className="flex items-center gap-2.5">
              <img
                src={currentRoom?.avatar}
                alt={currentRoom?.title}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-red-600/40"
              />
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentRoom?.title}</span>
                  {currentRoom?.tag && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-normal">
                      {currentRoom.tag}
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                  {currentRoom?.type === 'group' ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Circle className="w-1.5 h-1.5 fill-emerald-400" />
                      실시간 {currentRoom.participantCount}명 참여 중
                    </span>
                  ) : (
                    <span className="text-zinc-400">시네필 1:1 메시지</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center my-2">
              <span className="text-[10px] bg-zinc-900 text-zinc-500 px-3 py-1 rounded-full border border-zinc-800">
                🔒 시네필 상호 존중 채팅이 활성화되었습니다.
              </span>
            </div>

            {currentMessages.map((msg) => {
              const isMe = msg.isMe;
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  {!isMe && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-zinc-700"
                    />
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-red-600 text-white rounded-tr-none shadow-md shadow-red-950/40'
                        : 'bg-[#181824] text-zinc-200 border border-zinc-800 rounded-tl-none'
                    }`}
                  >
                    {!isMe && (
                      <span className="text-[10px] font-bold text-red-400 block mb-0.5">
                        {msg.senderName}
                      </span>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 ${
                        isMe ? 'text-red-200' : 'text-zinc-500'
                      }`}
                    >
                      {msg.createdAt}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-zinc-800 bg-[#0e0e14] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${currentRoom?.title}에 메시지 보내기...`}
              className="flex-1 bg-zinc-900 text-xs text-white placeholder-zinc-500 rounded-xl px-4 py-2.5 border border-zinc-700/60 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
