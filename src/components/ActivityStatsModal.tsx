import React from 'react';
import { X, Award, Film, BookMarked, PenTool, Flame, BarChart2, TrendingUp, CheckCircle } from 'lucide-react';
import { UserStats } from '../types';

interface ActivityStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
}

export const ActivityStatsModal: React.FC<ActivityStatsModalProps> = ({
  isOpen,
  onClose,
  userStats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12121a] border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl text-zinc-100">
        {/* Header */}
        <div className="sticky top-0 bg-[#12121a]/95 backdrop-blur-md p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">시네필 활동 분석 & 취향 리포트</h2>
              <p className="text-xs text-zinc-400">데이터로 기록된 나의 영화적 궤적</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* User Tier Badge Card */}
          <div className="bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-900 p-4 rounded-xl border border-red-900/40 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                  CineLog 등급
                </span>
                <span className="text-[10px] bg-red-900/60 text-red-200 px-1.5 py-0.5 rounded font-bold">
                  VERIFIED
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">{userStats.cinephileLevelTitle}</h3>
              <p className="text-xs text-zinc-400 mt-1">
                상위 3%의 깊이 있는 영화 감상 및 비평 활동을 기록 중입니다.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-red-500 cinema-title">{userStats.cinephileScore}</span>
              <span className="text-[11px] block text-zinc-400">시네마 점수</span>
            </div>
          </div>

          {/* 4 Stat Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-center">
              <Film className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{userStats.watchedMoviesCount}</div>
              <div className="text-[11px] text-zinc-400">감상 기록</div>
            </div>
            <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-center">
              <PenTool className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{userStats.writtenReviewsCount}</div>
              <div className="text-[11px] text-zinc-400">작성한 비평</div>
            </div>
            <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-center">
              <BookMarked className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{userStats.scrapsCount}</div>
              <div className="text-[11px] text-zinc-400">스크랩/북마크</div>
            </div>
            <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-center">
              <Flame className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{userStats.crewApplicationsCount}</div>
              <div className="text-[11px] text-zinc-400">스태프 지원/참여</div>
            </div>
          </div>

          {/* Genre Preference Visual Bars */}
          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-200">장르별 감상 선호도 비율</h4>
              <span className="text-[11px] text-zinc-500">최근 6개월 기준</span>
            </div>
            <div className="space-y-2.5">
              {userStats.topGenres.map((genre) => (
                <div key={genre.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-medium">{genre.name}</span>
                    <span className="text-zinc-400 font-bold">{genre.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${genre.percentage}%`,
                        backgroundColor: genre.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Directors & Taste Keywords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 space-y-2">
              <h4 className="text-xs font-bold text-zinc-200">가장 많이 탐독한 감독</h4>
              <ul className="space-y-1.5 text-xs">
                {userStats.topDirectors.map((director, i) => (
                  <li key={director.name} className="flex items-center justify-between text-zinc-300">
                    <span>
                      <span className="text-red-500 font-bold mr-1.5">{i + 1}.</span>
                      {director.name}
                    </span>
                    <span className="text-zinc-500">{director.worksWatched}작품</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 space-y-2">
              <h4 className="text-xs font-bold text-zinc-200">나의 시네마 키워드</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {userStats.activeTasteKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Activity Bars */}
          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-200">월별 활동 및 기록 빈도</h4>
              <span className="text-[11px] text-zinc-500">지속적인 시네필 활동 기록</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-24 pt-4 px-2">
              {userStats.monthlyActivities.map((item) => {
                const maxVal = 40;
                const heightPct = Math.round((item.logs / maxVal) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full bg-zinc-800 rounded-t h-full flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-red-800 to-red-500 rounded-t transition-all duration-500"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
