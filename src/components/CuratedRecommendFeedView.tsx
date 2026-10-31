import React, { useState } from 'react';
import { Sparkles, RefreshCw, Film, Compass, Flame, CheckCircle, ArrowRight } from 'lucide-react';
import { Post, UserStats } from '../types';
import { FeedCard } from './FeedCard';

interface CuratedRecommendFeedViewProps {
  posts: Post[];
  userStats: UserStats;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenChatWithAuthor: (authorId: string, authorName: string, authorAvatar: string) => void;
  onTagClick: (tag: string) => void;
  onOpenStats: () => void;
}

export const CuratedRecommendFeedView: React.FC<CuratedRecommendFeedViewProps> = ({
  posts,
  userStats,
  onLikeToggle,
  onBookmarkToggle,
  onAddComment,
  onOpenChatWithAuthor,
  onTagClick,
  onOpenStats,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    curatorOneLiner: string;
    tasteMatchScore: number;
    recommendations: Array<{ title: string; director: string; year: number; reason: string }>;
    cinematicInsight: string;
  } | null>({
    curatorOneLiner: '어둠 속 강렬한 대비와 깊은 미장센의 여운을 탐닉하는 네오 누아르 시네필',
    tasteMatchScore: 97,
    recommendations: [
      {
        title: '블레이드 러너 2049 (Blade Runner 2049)',
        director: '드니 빌뇌브',
        year: 2017,
        reason: '로저 디킨스의 압도적인 황금빛 미장센과 인간 실존에 대한 차가운 성찰',
      },
      {
        title: '화양연화 (In The Mood For Love)',
        director: '왕가위',
        year: 2000,
        reason: '스텝프린팅 촬영 기법과 첼로 선율이 직조해낸 찰나의 시네마토그래피',
      },
    ],
    cinematicInsight:
      '회원님의 최근 북마크 및 리뷰 작성 패턴은 촬영 기법(Cinematography)과 사운드 디자인의 조화에 가장 높은 가중치를 두고 있습니다.',
  });

  const handleRefreshAiCuration = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/curate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favoriteGenres: userStats.topGenres.map((g) => g.name),
          favoriteDirectors: userStats.topDirectors.map((d) => d.name),
          userKeywords: userStats.activeTasteKeywords,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiReport(data.data);
      }
    } catch (err) {
      console.warn('AI curate error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Sort posts by taste match score
  const recommendedPosts = [...posts].sort((a, b) => (b.tasteMatchScore || 0) - (a.tasteMatchScore || 0));

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* 1. Cinephile Taste Profile Card */}
      <div className="bg-gradient-to-br from-[#1c1214] via-[#12121c] to-[#121219] p-5 rounded-2xl border border-red-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-red-600/20 text-red-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white">
                {userStats.userName} 님의 시네마 취향 맞춤 피드
              </h2>
            </div>
            <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
              활동 통계(<span className="text-red-400 font-semibold">{userStats.watchedMoviesCount}편</span> 감상 기록 ·{' '}
              <span className="text-red-400 font-semibold">{userStats.writtenReviewsCount}개</span> 비평 분석)를 기반으로
              산출된 개인화 추천 피드입니다.
            </p>
          </div>

          <button
            onClick={onOpenStats}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 shrink-0 bg-zinc-900/80 px-2.5 py-1.5 rounded-lg border border-zinc-800 transition-colors"
          >
            <span>상세 통계</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Top Genre Breakdown Badges */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-zinc-500 font-medium">선호 취향 DNA:</span>
          {userStats.topGenres.map((g) => (
            <span
              key={g.name}
              className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-200 border border-zinc-700/60 font-medium flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
              {g.name} ({g.percentage}%)
            </span>
          ))}
        </div>
      </div>

      {/* 2. AI Cinephile Curator Card */}
      <div className="bg-[#12121b] p-4 sm:p-5 rounded-2xl border border-red-950/80 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-white">CineLog AI 큐레이터 리포트</h3>
          </div>
          <button
            onClick={handleRefreshAiCuration}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-red-500' : ''}`} />
            <span>{isAnalyzing ? '취향 재분석 중...' : '새로고침'}</span>
          </button>
        </div>

        {aiReport && (
          <div className="space-y-3 pt-1">
            <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/30">
              <span className="text-[11px] text-red-400 font-semibold block mb-1">
                시네필 성향 진단 ({aiReport.tasteMatchScore}% 매칭)
              </span>
              <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                &ldquo;{aiReport.curatorOneLiner}&rdquo;
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-zinc-400">오늘 밤 추천 숨은 걸작</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiReport.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-zinc-900/90 p-2.5 rounded-xl border border-zinc-800 text-xs">
                    <div className="font-bold text-zinc-100 flex items-center justify-between">
                      <span className="truncate">{rec.title}</span>
                      <span className="text-[10px] text-zinc-500 shrink-0 ml-1">{rec.year}</span>
                    </div>
                    <div className="text-[11px] text-red-400 mt-0.5">감독: {rec.director}</div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug line-clamp-2">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 bg-[#0d0d14] p-2.5 rounded-xl border border-zinc-800/80 leading-relaxed">
              💡 <span className="text-zinc-300 font-medium">{aiReport.cinematicInsight}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Personalized Posts Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            취향 적합도순 정렬 피드
          </span>
          <span className="text-xs text-zinc-500">실시간 피드백 반영</span>
        </div>

        {recommendedPosts.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            onLikeToggle={onLikeToggle}
            onBookmarkToggle={onBookmarkToggle}
            onAddComment={onAddComment}
            onOpenChatWithAuthor={onOpenChatWithAuthor}
            onTagClick={onTagClick}
          />
        ))}
      </div>
    </div>
  );
};
