import React, { useState, useMemo } from 'react';
import { MessageCircleQuestion, HelpCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { Post } from '../types';
import { FeedCard } from './FeedCard';

interface CommunityLoungeViewProps {
  posts: Post[];
  searchQuery: string;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenChatWithAuthor: (authorId: string, authorName: string, authorAvatar: string) => void;
  onTagClick: (tag: string) => void;
  onOpenCreateQuestion: () => void;
}

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'advice', label: '영화 고민상담' },
  { id: 'equipment', label: '촬영·장비 꿀팁' },
  { id: 'scenario', label: '시나리오 피드백' },
  { id: 'festival', label: '영화제 출품 정보' },
  { id: 'freetalk', label: '시네필 자유수다' },
];

export const CommunityLoungeView: React.FC<CommunityLoungeViewProps> = ({
  posts,
  searchQuery,
  onLikeToggle,
  onBookmarkToggle,
  onAddComment,
  onOpenChatWithAuthor,
  onTagClick,
  onOpenCreateQuestion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [solvedFilter, setSolvedFilter] = useState<'all' | 'unsolved' | 'solved'>('all');

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => post.boardType === 'community')
      .filter((post) => {
        if (selectedCategory === 'all') return true;
        return post.communityInfo?.category === selectedCategory;
      })
      .filter((post) => {
        if (solvedFilter === 'all') return true;
        if (solvedFilter === 'solved') return post.communityInfo?.isSolved === true;
        if (solvedFilter === 'unsolved') return post.communityInfo?.isSolved === false;
        return true;
      })
      .filter((post) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.hashtags.some((t) => t.toLowerCase().includes(q))
        );
      });
  }, [posts, selectedCategory, solvedFilter, searchQuery]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Banner */}
      <div className="bg-[#12121c] p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageCircleQuestion className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">시네마 고민상담 & 지식 라운지</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            제작 예산, 장비 렌탈, 시나리오 고민부터 진로 상담까지 선후배 영화인과 편하게 나눕니다.
          </p>
        </div>
        <button
          onClick={onOpenCreateQuestion}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors shrink-0"
        >
          고민 질문하기
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#12121c]/90 p-3.5 rounded-2xl border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-900/50'
                  : 'bg-zinc-800/70 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Solved Status Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60 text-xs">
          <span className="text-zinc-400 mr-1">답변 상태:</span>
          {(
            [
              { id: 'all', label: '전체' },
              { id: 'unsolved', label: '답변을 기다리는 고민' },
              { id: 'solved', label: '해결 완료' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setSolvedFilter(item.id)}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                solvedFilter === item.id
                  ? 'text-amber-400 font-bold bg-amber-950/40 border border-amber-800/50'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-[#111118] rounded-2xl border border-zinc-800 p-8">
          <MessageCircleQuestion className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">등록된 커뮤니티 글이 없습니다</h3>
          <p className="text-xs text-zinc-500 mb-4">가장 먼저 궁금한 점이나 고민을 작성해보세요.</p>
          <button
            onClick={onOpenCreateQuestion}
            className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
          >
            첫 질문 등록하기
          </button>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            onLikeToggle={onLikeToggle}
            onBookmarkToggle={onBookmarkToggle}
            onAddComment={onAddComment}
            onOpenChatWithAuthor={onOpenChatWithAuthor}
            onTagClick={onTagClick}
          />
        ))
      )}
    </div>
  );
};
