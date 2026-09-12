'use client';

import React, { useState } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import { Heart, Send, Bookmark, Sparkles, MessageCircle, Bell, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  author: string;
  role: string;
  text: string;
  time: string;
  likes: number;
  liked: boolean;
  saved: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    author: 'Alex Rivera',
    role: 'Lead Audio Architect',
    text: 'Just swapped out 4MB of raw WAV assets for 1.8KB of pure procedural Web Audio synthesis. Latency dropped to sub-millisecond on mobile!',
    time: '2m ago',
    likes: 24,
    liked: false,
    saved: false,
  },
  {
    id: '2',
    author: 'Elena Chen',
    role: 'Design Systems Eng',
    text: 'Adding tactile haptic feedback to our toggle switches completely elevated the tactile feel of our dashboard.',
    time: '8m ago',
    likes: 42,
    liked: true,
    saved: true,
  },
];

export function SocialFeedDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);

  const toggleLike = (id: string) => {
    playSound('haptic-pop');
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          const nextLiked = !msg.liked;
          return {
            ...msg,
            liked: nextLiked,
            likes: nextLiked ? msg.likes + 1 : msg.likes - 1,
          };
        }
        return msg;
      })
    );
  };

  const toggleSave = (id: string) => {
    playSound('snap');
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          return { ...msg, saved: !msg.saved };
        }
        return msg;
      })
    );
  };

  const triggerSparkle = () => {
    playSound('magic-sparkle');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playSound('send');
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      author: 'You',
      role: 'Frontend Developer',
      text: inputText.trim(),
      time: 'Just now',
      likes: 1,
      liked: true,
      saved: false,
    };

    setMessages((prev) => [newMsg, ...prev]);
    setInputText('');
  };

  const triggerNotification = () => {
    playSound('notification');
    setNotificationCount((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7 shadow-2xl text-neutral-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ff3700]/10 border border-[#ff3700]/20 flex items-center justify-center text-[#ff3700]">
            <MessageCircle size={16} />
          </div>
          <div>
            <h4 className="font-helvetica-neue text-sm font-semibold text-white">Social Activity & Messaging</h4>
            <p className="text-[11px] font-mono text-neutral-400">Micro-haptics, send whoosh & soft notifications</p>
          </div>
        </div>

        {/* Live Notification Trigger */}
        <button
          type="button"
          onClick={triggerNotification}
          title="Simulate push notification (ping)"
          className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.08] bg-[#1a1a1e] hover:bg-[#222226] text-xs font-mono text-neutral-300 transition-colors cursor-pointer select-none"
        >
          <Bell size={12} className="text-[#ff3700]" />
          <span>Alerts</span>
          {notificationCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#ff3700] text-[9px] font-bold text-white flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
      </div>

      {/* Message Feed */}
      <div className="mt-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-4 rounded-xl bg-[#16161a] border border-white/[0.04] transition-all hover:border-white/[0.08] animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-white/70 text-xs font-semibold">
                  {msg.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">{msg.author}</span>
                    <span className="text-[10px] font-mono text-neutral-500">{msg.time}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 block">{msg.role}</span>
                </div>
              </div>

              {/* Sparkle reward icon */}
              <button
                type="button"
                onClick={triggerSparkle}
                title="Send celebration sparkle (magic-sparkle)"
                className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer"
              >
                <Sparkles size={13} />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mt-2.5 pl-9">
              {msg.text}
            </p>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.04] pl-9">
              <div className="flex items-center gap-4">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => toggleLike(msg.id)}
                  title="Like post (haptic-pop)"
                  className={`inline-flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
                    msg.liked ? 'text-rose-400' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Heart
                    size={13}
                    className={`transition-transform duration-150 ${msg.liked ? 'fill-rose-400 scale-110' : ''}`}
                  />
                  <span>{msg.likes}</span>
                </button>

                {/* Reply */}
                <button
                  type="button"
                  onClick={() => playSound('blip')}
                  title="Reply (blip)"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <MessageCircle size={13} />
                  <span>Reply</span>
                </button>
              </div>

              {/* Bookmark */}
              <button
                type="button"
                onClick={() => toggleSave(msg.id)}
                title="Bookmark (snap)"
                className={`p-1 rounded transition-colors cursor-pointer ${
                  msg.saved ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Bookmark size={13} className={msg.saved ? 'fill-amber-400' : ''} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input Composer */}
      <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share your audio feedback..."
          className="flex-1 h-9.5 px-3.5 rounded-xl border border-white/[0.08] bg-[#16161a] text-xs font-mono text-white placeholder:text-neutral-500 outline-none focus:border-[#ff3700]/50 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          title="Send message (whoosh)"
          className="h-9.5 px-4 rounded-xl bg-[#ff3700] hover:bg-[#ff4500] disabled:opacity-40 text-white flex items-center justify-center gap-1.5 text-xs font-mono font-medium transition-all shadow-[0_0_16px_rgba(255,55,0,0.2)] cursor-pointer"
        >
          <span>Send</span>
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}
