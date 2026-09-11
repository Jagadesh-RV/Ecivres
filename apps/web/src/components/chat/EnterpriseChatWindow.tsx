'use client';

import React, { useState } from 'react';
import { Send, Mic, Paperclip, Pin, Smile, Phone, Video, Navigation, MapPin } from 'lucide-react';

export interface ChatMessage {
  id: string;
  senderName: string;
  isSelf: boolean;
  content: string;
  type: 'TEXT' | 'VOICE' | 'LOCATION';
  mediaUrl?: string;
  timestamp: string;
  isPinned?: boolean;
}

interface EnterpriseChatWindowProps {
  recipientName?: string;
  etaMinutes?: number;
  messages?: ChatMessage[];
  onSendMessage?: (content: string, type: 'TEXT' | 'VOICE') => void;
}

export const EnterpriseChatWindow: React.FC<EnterpriseChatWindowProps> = ({
  recipientName = 'Marcus Vance (Master Electrician)',
  etaMinutes = 12,
  messages = [
    {
      id: 'm1',
      senderName: 'Marcus Vance',
      isSelf: false,
      content: 'I am currently en route with the replacement circuit breaker.',
      type: 'TEXT',
      timestamp: '14:20',
    },
    {
      id: 'm2',
      senderName: 'Marcus Vance',
      isSelf: false,
      content: 'Voice note (0:14)',
      type: 'VOICE',
      mediaUrl: 'https://example.com/audio.mp3',
      timestamp: '14:21',
    },
  ],
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage?.(inputText, 'TEXT');
    setInputText('');
  };

  return (
    <div className="w-full h-[600px] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-white">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
            {recipientName[0]}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{recipientName}</h3>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Provider Arriving in ~{etaMinutes} mins</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5 text-xs font-semibold px-3">
            <Navigation className="w-3.5 h-3.5" />
            <span>Track Live</span>
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[75%] p-3.5 rounded-2xl text-xs ${
                msg.isSelf
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}
            >
              {msg.type === 'VOICE' ? (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-indigo-500 text-white">▶</div>
                  <span>🎤 Voice Note (0:14)</span>
                </div>
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <button type="button" className="p-2 text-slate-400 hover:text-white">
          <Paperclip className="w-4 h-4" />
        </button>
        <button type="button" className="p-2 text-slate-400 hover:text-white">
          <Mic className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
