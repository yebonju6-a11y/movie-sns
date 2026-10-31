import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Sparkles, Film, ArrowDownWideNarrow } from 'lucide-react';
import { Post } from '../types';
import { FeedCard } from './FeedCard';

interface HobbyFeedViewProps {
  posts: Post[];
  searchQuery: string;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenChatWithAuthor: (authorId: string, authorName: string, authorAvatar: string) => void;
  onTagClick: (tag: string) => void;
}

const GENRES = ['전체', '누아르', 'SF', '로맨스', '스릴러', '독립예술', '드라마'];
const ERAS = ['전체', '2020년대', '2010년대', '2000년대', '90년대'];
const SORT_OPTIONS = [
  { id: 'latest', label: '최신순' },
  { id: 'popular', label: '인기순' },
  { id: 'rating', label: '별점 높은순' },
];

export const HobbyFeedView: React.FC<HobbyFeedViewProps> = ({
  posts,
  searchQuery,
  onLikeToggle,
  onBookmarkToggle,
  onAddComment,
  onOpenChatWithAuthor,
  onTagClick,
}) => {
  const [selectedGenre, setSelectedGenre] = useState('전체');
  const [selectedEra, setSelectedEra] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('latest');

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => post.boardType === 'hobby')
      .filter((post) => {
        if (selectedGenre === '전체') return true;
        const g = post.movieInfo?.genre || '';
        return g.includes(selectedGenre);
      })
      .filter((post) => {
        if (selectedEra === '전체') return true;
        const year = post.movieInfo?.year || 2020;
        if (selectedEra === '2020년대') return year >= 2020;
        if (selectedEra === '2010년대') return year >= 2010 && year < 2020;
        if (selectedEra === '2000년대') return year >= 2000 && year < 2010;
        if (selectedEra === '90년대') return year < 2000;
        return true;
      })
      .filter((post) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.movieInfo?.title.toLowerCase().includes(q) ||
          post.movieInfo?.director.toLowerCase().includes(q) ||
          post.hashtags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (selectedSort === 'popular') return b.likesCount - a.likesCount;
        if (selectedSort === 'rating') {
          return (b.movieInfo?.rating || 0) - (a.movieInfo?.rating || 0);
        }
        return 0; // latest is default array order
      });
  }, [posts, selectedGenre, selectedEra, selectedSort, searchQuery]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Board Description Banner */}
      <div className="bg-[#12121c] p-4 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-red-500" />
            <h2 className="text-base font-bold text-white">취미 영화 아카이브 & 리뷰</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            영화의 미장센, 사운드, 감독론을 사진과 함께 나누는 시네필 전용 피드입니다.
          </p>
        </div>
        <span className="text-xs font-semibold text-zinc-400">
          총 <span className="text-red-400 font-bold">{filteredPosts.length}</span>편
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#12121c]/90 p-3 rounded-2xl border border-zinc-800 space-y-3">
        {/* Genre Selector */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs text-zinc-400 shrink-0 font-medium mr-1">장르:</span>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                selectedGenre === genre
                  ? 'bg-red-600 text-white shadow-sm shadow-red-900/50'
                  : 'bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Era & Sort Selector */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs text-zinc-400 shrink-0 font-medium mr-1">시대:</span>
            {ERAS.map((era) => (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`px-2.5 py-0.5 rounded text-xs transition-colors shrink-0 ${
                  selectedEra === era
                    ? 'text-red-400 font-bold bg-red-950/40 border border-red-800/50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {era}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs">
            <ArrowDownWideNarrow className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-transparent text-zinc-300 font-medium focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-zinc-900 text-zinc-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-[#111118] rounded-2xl border border-zinc-800 p-8">
          <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">해당 조건의 영화 게시물이 없습니다</h3>
          <p className="text-xs text-zinc-500 mb-4">필터를 초기화하거나 첫 감상평을 남겨보세요.</p>
          <button
            onClick={() => {
              setSelectedGenre('전체');
              setSelectedEra('전체');
            }}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
          >
            필터 초기화
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
