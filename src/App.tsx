/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BoardType, Post, UserStats, ChatRoom, ChatMessage } from './types';
import {
  INITIAL_POSTS,
  INITIAL_USER_STATS,
  INITIAL_CHAT_ROOMS,
  INITIAL_CHAT_MESSAGES,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { NavigationTabs } from './components/NavigationTabs';
import { HobbyFeedView } from './components/HobbyFeedView';
import { ProRecruitFeedView } from './components/ProRecruitFeedView';
import { CommunityLoungeView } from './components/CommunityLoungeView';
import { CuratedRecommendFeedView } from './components/CuratedRecommendFeedView';
import { ActivityStatsModal } from './components/ActivityStatsModal';
import { CinephileOnboardingModal } from './components/CinephileOnboardingModal';
import { ChatDrawer } from './components/ChatDrawer';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetailModal } from './components/PostDetailModal';
import { Sparkles, Film, Heart, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<BoardType>('hobby');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<Post | null>(null);

  // Chat state
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(INITIAL_CHAT_ROOMS);
  const [messagesRecord, setMessagesRecord] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string>('room-group-1');

  // Feedback Toast
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Like Toggle
  const handleLikeToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  // Bookmark Toggle
  const handleBookmarkToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextBookmarked = !p.isBookmarked;
          setUserStats((stats) => ({
            ...stats,
            scrapsCount: nextBookmarked ? stats.scrapsCount + 1 : Math.max(0, stats.scrapsCount - 1),
          }));
          showToast(
            nextBookmarked ? '시네마 보관함에 저장되었습니다.' : '보관함 저장이 취소되었습니다.',
            'info'
          );
          return {
            ...p,
            isBookmarked: nextBookmarked,
            bookmarksCount: nextBookmarked ? p.bookmarksCount + 1 : p.bookmarksCount - 1,
          };
        }
        return p;
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      authorName: userStats.userName,
      authorHandle: userStats.handle,
      authorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      content: text,
      createdAt: '방금 전',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );
    showToast('코멘트가 성공적으로 등록되었습니다.');
  };

  // Create Post
  const handleCreatePost = (newPostData: Partial<Post>) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      boardType: newPostData.boardType || 'hobby',
      author: {
        id: 'me',
        name: userStats.userName,
        handle: userStats.handle,
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        isVerifiedCinephile: true,
        roleBadge: userStats.cinephileLevelTitle,
        cinephileLevel: 4,
      },
      title: newPostData.title || '',
      content: newPostData.content || '',
      images: newPostData.images || [],
      movieInfo: newPostData.movieInfo,
      proInfo: newPostData.proInfo,
      communityInfo: newPostData.communityInfo,
      hashtags: newPostData.hashtags || ['영화'],
      likesCount: 1,
      isLiked: true,
      bookmarksCount: 0,
      isBookmarked: false,
      commentsCount: 0,
      comments: [],
      createdAt: '방금 전',
      tasteMatchScore: 99,
      aiRecommendationReason: '회원님이 직접 창작하신 최신 시네마 게시물입니다.',
    };

    setPosts((prev) => [newPost, ...prev]);
    setUserStats((stats) => ({
      ...stats,
      writtenReviewsCount: stats.writtenReviewsCount + 1,
      cinephileScore: stats.cinephileScore + 25,
    }));
    setActiveTab(newPost.boardType);
    showToast('게시물이 성공적으로 피드에 등록되었습니다!');
  };

  // Open Chat with Author
  const handleOpenChatWithAuthor = (
    authorId: string,
    authorName: string,
    authorAvatar: string,
    projectTitle?: string
  ) => {
    const existingRoom = chatRooms.find(
      (r) => r.type === 'direct' && r.title.includes(authorName)
    );

    if (existingRoom) {
      setActiveChatRoomId(existingRoom.id);
    } else {
      const newRoomId = `dm-${authorId}-${Date.now()}`;
      const newRoom: ChatRoom = {
        id: newRoomId,
        type: 'direct',
        title: projectTitle ? `${authorName} (<${projectTitle}>)` : authorName,
        avatar: authorAvatar,
        lastMessage: '대화를 시작했습니다.',
        lastMessageTime: '방금',
        unreadCount: 0,
        isOnline: true,
        tag: projectTitle ? '스태프 채용 문의' : '1:1 메시지',
      };
      setChatRooms((prev) => [newRoom, ...prev]);
      setMessagesRecord((prev) => ({
        ...prev,
        [newRoomId]: [
          {
            id: `msg-${Date.now()}`,
            senderId: 'me',
            senderName: userStats.userName,
            senderAvatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
            text: projectTitle
              ? `안녕하세요! <${projectTitle}> 공고를 보고 문의드립니다.`
              : '안녕하세요! 올려주신 시네마 게시물 인상 깊게 보았습니다.',
            createdAt: '방금',
            isMe: true,
          },
        ],
      }));
      setActiveChatRoomId(newRoomId);
    }
    setIsChatOpen(true);
  };

  // Send Chat Message
  const handleSendMessage = (roomId: string, text: string) => {
    const isMe = !text.startsWith('이 작품') && !text.startsWith('오늘 밤');
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: isMe ? 'me' : 'cinephile-bot',
      senderName: isMe ? userStats.userName : '시네마 살롱 봇',
      senderAvatar: isMe
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      text,
      createdAt: '방금',
      isMe,
    };

    setMessagesRecord((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newMsg],
    }));

    setChatRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              lastMessage: text,
              lastMessageTime: '방금',
            }
          : r
      )
    );
  };

  const totalUnreadChat = chatRooms.reduce((acc, r) => acc + r.unreadCount, 0);

  const boardCounts = {
    hobby: posts.filter((p) => p.boardType === 'hobby').length,
    pro: posts.filter((p) => p.boardType === 'pro').length,
    community: posts.filter((p) => p.boardType === 'community').length,
    recommended: posts.length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-zinc-100 flex flex-col cinema-grain selection:bg-red-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        userStats={userStats}
        unreadChatCount={totalUnreadChat}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
        activeSearchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Boards Navigation */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={boardCounts}
      />

      {/* Active Board Feed View */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-5 sm:py-6">
        {activeTab === 'hobby' && (
          <HobbyFeedView
            posts={posts}
            searchQuery={searchQuery}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onAddComment={handleAddComment}
            onOpenChatWithAuthor={handleOpenChatWithAuthor}
            onTagClick={setSearchQuery}
          />
        )}

        {activeTab === 'pro' && (
          <ProRecruitFeedView
            posts={posts}
            searchQuery={searchQuery}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onAddComment={handleAddComment}
            onOpenChatWithAuthor={handleOpenChatWithAuthor}
            onTagClick={setSearchQuery}
          />
        )}

        {activeTab === 'community' && (
          <CommunityLoungeView
            posts={posts}
            searchQuery={searchQuery}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onAddComment={handleAddComment}
            onOpenChatWithAuthor={handleOpenChatWithAuthor}
            onTagClick={setSearchQuery}
            onOpenCreateQuestion={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'recommended' && (
          <CuratedRecommendFeedView
            posts={posts}
            userStats={userStats}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onAddComment={handleAddComment}
            onOpenChatWithAuthor={handleOpenChatWithAuthor}
            onTagClick={setSearchQuery}
            onOpenStats={() => setIsStatsModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#08080b] py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="cinema-title font-black text-zinc-300">CINE.LOG</span>
            <span>· 오직 시네필을 위한 영화 특화 소셜 네트워크</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <button onClick={() => setIsOnboardingModalOpen(true)} className="hover:text-red-400">
              시네필 입회 검증
            </button>
            <button onClick={() => setIsStatsModalOpen(true)} className="hover:text-red-400">
              활동 통계 분석
            </button>
            <button onClick={() => setIsChatOpen(true)} className="hover:text-red-400">
              실시간 오픈 살롱
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-ins */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitPost={handleCreatePost}
        defaultBoard={activeTab}
      />

      <ActivityStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        userStats={userStats}
      />

      <CinephileOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onComplete={(updated) => {
          setUserStats((prev) => ({ ...prev, ...updated }));
          showToast('공인 시네필 검증이 완료되었습니다! 맞춤 큐레이션이 갱신되었습니다.');
        }}
      />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        rooms={chatRooms}
        messagesRecord={messagesRecord}
        activeRoomId={activeChatRoomId}
        onSelectRoom={setActiveChatRoomId}
        onSendMessage={handleSendMessage}
      />

      <PostDetailModal
        post={selectedPostForDetail}
        onClose={() => setSelectedPostForDetail(null)}
        onLikeToggle={handleLikeToggle}
        onBookmarkToggle={handleBookmarkToggle}
        onAddComment={handleAddComment}
        onOpenChatWithAuthor={handleOpenChatWithAuthor}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161622] border border-red-800/80 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
