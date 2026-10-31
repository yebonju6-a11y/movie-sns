import React, { useState, useMemo } from 'react';
import { Briefcase, Filter, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Post } from '../types';
import { FeedCard } from './FeedCard';

interface ProRecruitFeedViewProps {
  posts: Post[];
  searchQuery: string;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenChatWithAuthor: (authorId: string, authorName: string, authorAvatar: string, projectTitle?: string) => void;
  onTagClick: (tag: string) => void;
}

const ROLES = ['전체', '촬영', '연출', '동시녹음', '미술/의상', '배우', '제작/PD', '편집'];
const PROJECT_TYPES = ['전체', '단편영화', '장편독립', '웹드라마', '학생졸업작품', '광고/MV'];

export const ProRecruitFeedView: React.FC<ProRecruitFeedViewProps> = ({
  posts,
  searchQuery,
  onLikeToggle,
  onBookmarkToggle,
  onAddComment,
  onOpenChatWithAuthor,
  onTagClick,
}) => {
  const [selectedRole, setSelectedRole] = useState('전체');
  const [selectedProjectType, setSelectedProjectType] = useState('전체');
  const [onlyRecruiting, setOnlyRecruiting] = useState(true);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => post.boardType === 'pro')
      .filter((post) => {
        if (!onlyRecruiting) return true;
        return post.proInfo?.status === 'recruiting';
      })
      .filter((post) => {
        if (selectedRole === '전체') return true;
        const role = post.proInfo?.roleNeeded || '';
        return role.includes(selectedRole);
      })
      .filter((post) => {
        if (selectedProjectType === '전체') return true;
        return post.proInfo?.projectType === selectedProjectType;
      })
      .filter((post) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.proInfo?.projectTitle.toLowerCase().includes(q) ||
          post.proInfo?.roleNeeded.toLowerCase().includes(q) ||
          post.hashtags.some((t) => t.toLowerCase().includes(q))
        );
      });
  }, [posts, selectedRole, selectedProjectType, onlyRecruiting, searchQuery]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Board Header Banner */}
      <div className="bg-gradient-to-r from-[#171217] via-[#12121c] to-[#171217] p-4 rounded-2xl border border-red-900/40 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-base font-bold text-white">영화인 전문 구인구직 & 스태프 모집</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              상업·독립 단편, 장편, 학생 영화의 제작팀(촬영/조명/녹음/미술/배우)을 연결합니다.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-red-950/80 text-red-400 border border-red-800/60 shrink-0">
            진행중 공고 {filteredPosts.filter((p) => p.proInfo?.status === 'recruiting').length}건
          </span>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-[#12121c]/90 p-3.5 rounded-2xl border border-zinc-800 space-y-3">
        {/* Role Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs text-zinc-400 shrink-0 font-medium mr-1">직무/파트:</span>
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                selectedRole === role
                  ? 'bg-red-600 text-white shadow-sm shadow-red-900/50'
                  : 'bg-zinc-800/70 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Project Format & Status Toggle */}
        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-zinc-800/60 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs text-zinc-400 shrink-0 font-medium mr-1">작품형태:</span>
            {PROJECT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedProjectType(type)}
                className={`px-2.5 py-0.5 rounded text-xs transition-colors shrink-0 ${
                  selectedProjectType === type
                    ? 'text-red-400 font-bold bg-red-950/40 border border-red-800/50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyRecruiting}
              onChange={(e) => setOnlyRecruiting(e.target.checked)}
              className="accent-red-600 rounded cursor-pointer"
            />
            <span className={onlyRecruiting ? 'text-red-400 font-semibold' : ''}>
              모집중 공고만 보기
            </span>
          </label>
        </div>
      </div>

      {/* Recruits List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-[#111118] rounded-2xl border border-zinc-800 p-8">
          <Briefcase className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">
            해당 조건의 구인 공고가 없습니다
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            파트나 필터 조건을 변경하시거나 새 스태프 모집 공고를 등록해보세요.
          </p>
          <button
            onClick={() => {
              setSelectedRole('전체');
              setSelectedProjectType('전체');
              setOnlyRecruiting(false);
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
