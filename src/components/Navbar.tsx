import React from 'react';
import { Film, MessageSquare, Plus, Bell, Sparkles, BarChart3, ShieldCheck } from 'lucide-react';
import { UserStats } from '../types';

interface NavbarProps {
  userStats: UserStats;
  unreadChatCount: number;
  onOpenCreateModal: () => void;
  onOpenChat: () => void;
  onOpenStats: () => void;
  onOpenOnboarding: () => void;
  activeSearchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userStats,
  unreadChatCount,
  onOpenCreateModal,
  onOpenChat,
  onOpenStats,
  onOpenOnboarding,
  activeSearchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0df0] backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg shadow-red-900/30 border border-red-500/30">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="cinema-title text-xl font-black tracking-wider text-white">CINE<span className="text-red-500">.</span>LOG</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">CINEPHILE SNS</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">영화 정보 피드 & 스태프 구인 커뮤니티</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="영화 제목, 감독, 스태프 파트(촬영/조명), 키워드 검색..."
              className="w-full bg-[#14141c] text-sm text-zinc-200 placeholder-zinc-500 rounded-full pl-4 pr-10 py-2 border border-zinc-700/60 focus:border-red-500/80 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
            />
            {activeSearchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Onboarding Screening Button */}
          <button
            onClick={onOpenOnboarding}
            title="시네필 사전 질문 / 검증"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-700/70 hover:border-zinc-500 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden lg:inline font-medium">시네필 검증</span>
          </button>

          {/* Activity Analytics Button */}
          <button
            onClick={onOpenStats}
            title="취향 통계 및 활동 분석"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-700/70 hover:border-red-500/50 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-medium">활동 통계</span>
          </button>

          {/* Real-time Chat Drawer Toggle */}
          <button
            onClick={onOpenChat}
            className="relative p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/70 transition-colors"
            title="실시간 채팅 및 1:1 문의"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Create Post Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-900/40 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>새 글 작성</span>
          </button>
        </div>
      </div>
    </header>
  );
};
