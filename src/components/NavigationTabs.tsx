import React from 'react';
import { Film, Briefcase, MessageCircleQuestion, Sparkles } from 'lucide-react';
import { BoardType } from '../types';

interface NavigationTabsProps {
  activeTab: BoardType;
  onTabChange: (tab: BoardType) => void;
  counts?: {
    hobby: number;
    pro: number;
    community: number;
    recommended: number;
  };
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs = [
    {
      id: 'hobby' as BoardType,
      label: '취미 영화 피드',
      sublabel: '영화 리뷰 & 미장센',
      icon: Film,
      count: counts?.hobby,
    },
    {
      id: 'pro' as BoardType,
      label: '전문 스태프 구인구직',
      sublabel: '제작팀 & 배우 모집',
      icon: Briefcase,
      count: counts?.pro,
      badge: 'PRO',
    },
    {
      id: 'community' as BoardType,
      label: '시네마 고민상담',
      sublabel: '장비·시나리오 질답',
      icon: MessageCircleQuestion,
      count: counts?.community,
    },
    {
      id: 'recommended' as BoardType,
      label: '맞춤 추천 피드',
      sublabel: '취향 분석 AI 큐레이션',
      icon: Sparkles,
      count: counts?.recommended,
      badge: 'AI',
    },
  ];

  return (
    <div className="w-full bg-[#0d0d14] border-b border-zinc-800/80 sticky top-[61px] z-30">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 flex items-center justify-between overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[140px] sm:min-w-0 py-2.5 px-3 rounded-lg text-left transition-all relative group flex flex-col items-center sm:items-start ${
                isActive
                  ? 'bg-zinc-900/90 text-white shadow-inner border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-red-500' : 'text-zinc-500'
                  }`}
                />
                <span className="text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap">
                  {tab.label}
                </span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                      tab.badge === 'AI'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-zinc-700/50 text-zinc-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 mt-0.5 hidden sm:block">
                {tab.sublabel}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
