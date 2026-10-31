import React, { useState } from 'react';
import { X, Heart, Bookmark, Share2, Star, Send, Film, Briefcase, Sparkles, MessageSquare } from 'lucide-react';
import { Post } from '../types';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenChatWithAuthor: (authorId: string, authorName: string, authorAvatar: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onLikeToggle,
  onBookmarkToggle,
  onAddComment,
  onOpenChatWithAuthor,
}) => {
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#101018] border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Left: High-res Still / Media */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-full">
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full max-h-[70vh] md:max-h-full object-contain"
          />
          <button
            onClick={onClose}
            className="md:hidden absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Author, Caption & Comments Thread */}
        <div className="w-full md:w-2/5 flex flex-col h-full bg-[#111119] border-t md:border-t-0 md:border-l border-zinc-800">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-red-600/50"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{post.author.name}</h4>
                <span className="text-xs text-zinc-400">{post.author.handle}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hidden md:block p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body & Comments scroll area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Title */}
            <h3 className="text-base font-bold text-zinc-100">{post.title}</h3>

            {/* Movie Info if present */}
            {post.movieInfo && (
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between font-semibold text-zinc-200">
                  <span>{post.movieInfo.title} ({post.movieInfo.year})</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < post.movieInfo!.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-zinc-400">감독: {post.movieInfo.director} · {post.movieInfo.genre}</div>
              </div>
            )}

            {/* Pro Info if present */}
            {post.proInfo && (
              <div className="p-3 bg-[#181826] rounded-xl border border-zinc-700/80 space-y-1.5">
                <span className="text-red-400 font-bold block">모집 역할: {post.proInfo.roleNeeded}</span>
                <p className="text-zinc-300">작품: {post.proInfo.projectTitle} ({post.proInfo.projectType})</p>
                <p className="text-zinc-400">일정: {post.proInfo.period}</p>
                <p className="text-amber-400 font-semibold">조건: {post.proInfo.remuneration}</p>
              </div>
            )}

            {/* Caption */}
            <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm">
              {post.content}
            </p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1">
              {post.hashtags.map((tag, idx) => (
                <span key={idx} className="text-zinc-400">#{tag}</span>
              ))}
            </div>

            {/* Comments */}
            <div className="pt-3 border-t border-zinc-800 space-y-2.5">
              <span className="text-xs font-bold text-zinc-400">댓글 ({post.comments.length})</span>
              {post.comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2 text-xs">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    className="w-6 h-6 rounded-full object-cover mt-0.5"
                  />
                  <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-zinc-200">{c.authorName}</span>
                      <span className="text-[10px] text-zinc-500">{c.createdAt}</span>
                    </div>
                    <p className="text-zinc-300">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom actions & comment input */}
          <div className="p-4 border-t border-zinc-800 bg-[#0d0d14] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onLikeToggle(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold ${
                    post.isLiked ? 'text-red-500' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-red-500' : ''}`} />
                  <span>{post.likesCount}</span>
                </button>
                <button
                  onClick={() => onBookmarkToggle(post.id)}
                  className={`text-xs ${
                    post.isBookmarked ? 'text-red-500' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-red-500' : ''}`} />
                </button>
              </div>
              <span className="text-xs text-zinc-500">{post.createdAt}</span>
            </div>

            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글 남기기..."
                className="flex-1 bg-zinc-900 text-xs text-white rounded-lg px-3 py-2 border border-zinc-800 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2 bg-red-600 disabled:bg-zinc-800 text-white rounded-lg"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
