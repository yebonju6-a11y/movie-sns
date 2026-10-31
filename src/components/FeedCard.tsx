import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Star,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  HelpCircle,
  Quote,
} from 'lucide-react';
import { Post, Comment } from '../types';

interface FeedCardProps {
  post: Post;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenChatWithAuthor: (authorId: string, authorName: string, authorAvatar: string, projectTitle?: string) => void;
  onTagClick: (tag: string) => void;
  onPostClick?: (post: Post) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  post,
  onLikeToggle,
  onBookmarkToggle,
  onAddComment,
  onOpenChatWithAuthor,
  onTagClick,
  onPostClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  const handleDoubleTap = () => {
    setShowHeartBurst(true);
    if (!post.isLiked) {
      onLikeToggle(post.id);
    }
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
    setShowComments(true);
  };

  const handleShare = () => {
    setShareCopied(true);
    navigator.clipboard?.writeText?.(window.location.href);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const hasMultipleImages = post.images && post.images.length > 1;

  return (
    <article className="bg-[#111118] border border-zinc-800/90 rounded-2xl overflow-hidden shadow-xl mb-6 transition-all hover:border-zinc-700/80">
      {/* 1. Header: Author and Category */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => onOpenChatWithAuthor(post.author.id, post.author.name, post.author.avatar)}>
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-red-600/40"
            />
            {post.author.isVerifiedCinephile && (
              <span className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-0.5" title="검증된 시네필">
                <CheckCircle2 className="w-3 h-3" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-white hover:text-red-400 cursor-pointer transition-colors">
                {post.author.name}
              </span>
              <span className="text-xs text-zinc-400">{post.author.handle}</span>
              {post.author.roleBadge && (
                <span className="text-[11px] font-medium text-red-300/90 ml-1">
                  · {post.author.roleBadge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>{post.createdAt}</span>
              <span aria-hidden="true">·</span>
              {post.boardType === 'hobby' && <span>취미 리뷰</span>}
              {post.boardType === 'pro' && <span className="text-red-400 font-medium">스태프 구인</span>}
              {post.boardType === 'community' && <span className="text-amber-400 font-medium">시네마 고민</span>}
              {post.boardType === 'recommended' && <span className="text-red-400 font-medium">AI 맞춤 추천</span>}
            </div>
          </div>
        </div>

        {/* Board Category Pill */}
        <div>
          {post.boardType === 'pro' && post.proInfo && (
            <span
              className={`text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide border ${
                post.proInfo.status === 'recruiting'
                  ? 'bg-red-950/70 text-red-400 border-red-800/80 animate-pulse'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {post.proInfo.status === 'recruiting' ? '모집중' : '모집마감'}
            </span>
          )}
          {post.boardType === 'community' && post.communityInfo && (
            <span
              className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                post.communityInfo.isSolved
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/70'
                  : 'bg-amber-950/60 text-amber-400 border-amber-800/70'
              }`}
            >
              {post.communityInfo.isSolved ? '해결됨' : '답변대기'}
            </span>
          )}
          {post.tasteMatchScore && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-950/50 border border-red-800/60 text-red-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{post.tasteMatchScore}% 일치</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Media Image Carousel (Cinema 16:9 format) */}
      {post.images && post.images.length > 0 && (
        <div
          className="relative aspect-video sm:aspect-[16/9] w-full bg-black overflow-hidden select-none group cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={post.images[currentImageIndex]}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            loading="lazy"
          />

          {/* Film Grain Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Double-tap Heart Burst Animation */}
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <Heart className="w-24 h-24 text-red-600 fill-red-600 animate-ping opacity-90 drop-shadow-2xl" />
            </div>
          )}

          {/* Carousel Arrows */}
          {hasMultipleImages && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => prev - 1);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all backdrop-blur-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {currentImageIndex < post.images.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => prev + 1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all backdrop-blur-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              {/* Pagination Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {post.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'w-5 bg-red-600' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Film Meta Overlay Bottom Left */}
          {post.movieInfo && (
            <div className="absolute bottom-3 left-4 right-4 pointer-events-none z-10">
              <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-300 drop-shadow">
                <span className="font-semibold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  {post.movieInfo.title} ({post.movieInfo.year})
                </span>
                <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  감독: {post.movieInfo.director}
                </span>
                <div className="flex items-center gap-0.5 text-amber-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < post.movieInfo!.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Actions Toolbar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-800/50">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={() => onLikeToggle(post.id)}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-red-500 transition-colors group"
          >
            <Heart
              className={`w-5 h-5 transition-transform group-hover:scale-125 ${
                post.isLiked ? 'fill-red-600 text-red-600' : 'text-zinc-300'
              }`}
            />
            <span className="text-xs font-semibold">{post.likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-semibold">{post.commentsCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="text-zinc-400 hover:text-white transition-colors relative"
            title="게시물 링크 복사"
          >
            <Share2 className="w-5 h-5" />
            {shareCopied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-800 text-[10px] text-zinc-200 px-2 py-0.5 rounded border border-zinc-700 whitespace-nowrap">
                복사됨!
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Pro Action: 1:1 Contact Button */}
          {post.boardType === 'pro' && (
            <button
              onClick={() =>
                onOpenChatWithAuthor(
                  post.author.id,
                  post.author.name,
                  post.author.avatar,
                  post.proInfo?.projectTitle
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-md shadow-red-900/30"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>지원 및 1:1 문의</span>
            </button>
          )}

          {/* Bookmark Button */}
          <button
            onClick={() => onBookmarkToggle(post.id)}
            className="text-zinc-400 hover:text-red-500 transition-colors"
            title="보관함에 저장"
          >
            <Bookmark
              className={`w-5 h-5 ${
                post.isBookmarked ? 'fill-red-500 text-red-500' : 'text-zinc-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. Body Content */}
      <div className="p-4 space-y-3">
        {/* Post Title */}
        <h3
          onClick={() => onPostClick?.(post)}
          className="text-base sm:text-lg font-bold text-zinc-100 hover:text-red-400 transition-colors cursor-pointer"
        >
          {post.title}
        </h3>

        {/* AI Recommendation Reason Banner (if Recommended) */}
        {post.aiRecommendationReason && (
          <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-zinc-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-red-300 block mb-0.5">CineLog AI 취향 분석 매칭</span>
              <p className="text-zinc-400 leading-relaxed">{post.aiRecommendationReason}</p>
            </div>
          </div>
        )}

        {/* Special Board Info Panels */}
        {/* Pro Information Panel */}
        {post.boardType === 'pro' && post.proInfo && (
          <div className="bg-[#171722] p-3.5 rounded-xl border border-zinc-700/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-zinc-400 font-medium">모집분야:</span>
              <span className="text-red-400 font-bold">{post.proInfo.roleNeeded}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-zinc-400 font-medium">작품형태:</span>
              <span>{post.proInfo.projectType}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>{post.proInfo.period}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{post.proInfo.location}</span>
            </div>
            <div className="col-span-full pt-1.5 border-t border-zinc-700/40 flex items-center justify-between text-zinc-300">
              <span className="text-zinc-400 font-medium">급여/조건:</span>
              <span className="text-amber-400 font-semibold">{post.proInfo.remuneration}</span>
            </div>
          </div>
        )}

        {/* Cinema Quote Panel (Hobby) */}
        {post.movieInfo?.quote && (
          <div className="p-3 rounded-xl bg-zinc-900/60 border-l-2 border-red-600 text-xs text-zinc-300 italic flex items-center gap-2">
            <Quote className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>&ldquo;{post.movieInfo.quote}&rdquo;</span>
          </div>
        )}

        {/* Expandable Caption Text */}
        <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
          {isExpanded ? post.content : post.content.slice(0, 140)}
          {post.content.length > 140 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-zinc-500 hover:text-red-400 ml-2 font-medium"
            >
              {isExpanded ? '접기' : '...더보기'}
            </button>
          )}
        </div>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.hashtags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => onTagClick(tag)}
                className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. Comments Section (Slide-down) */}
      {showComments && (
        <div className="px-4 pb-4 pt-2 border-t border-zinc-800/80 bg-[#0d0d14]/70 space-y-3">
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {post.comments.length === 0 ? (
              <p className="text-xs text-zinc-500 py-2">첫 번째 시네필 코멘트를 남겨보세요.</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    className="w-6 h-6 rounded-full object-cover mt-0.5"
                  />
                  <div className="flex-1 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-zinc-200">{comment.authorName}</span>
                      <span className="text-[10px] text-zinc-500">{comment.createdAt}</span>
                    </div>
                    <p className="text-zinc-300 leading-snug">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="영화에 대한 감상이나 문의를 남겨보세요..."
              className="flex-1 bg-[#14141c] text-xs text-zinc-200 placeholder-zinc-500 rounded-lg px-3 py-2 border border-zinc-700/60 focus:border-red-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
