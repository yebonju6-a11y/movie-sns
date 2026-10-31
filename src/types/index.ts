export type BoardType = 'hobby' | 'pro' | 'community' | 'recommended';

export interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isVerifiedCinephile: boolean;
  roleBadge?: string; // e.g. "시네필 에디터", "촬영감독", "독립영화 프로듀서"
  cinephileLevel: number;
}

export interface Comment {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface MovieInfo {
  title: string;
  director: string;
  year: number;
  genre: string;
  rating: number; // 1-5
  stillUrl: string;
  platform?: string; // 극장, Netflix, Watcha, OTT, 단편상영
  quote?: string;
}

export interface ProInfo {
  roleNeeded: string; // 연출, 촬영, 조명, 동시녹음, 미술/소품, 편집, 배우, 프로듀서
  projectTitle: string;
  projectType: '단편영화' | '장편독립' | '웹드라마' | '광고/MV' | '학생졸업작품';
  period: string; // e.g., "2026.11.15 ~ 11.20 (총 4회차)"
  location: string; // e.g., "서울 마포구 & 경기 파주"
  remuneration: string; // e.g., "회차당 25만원 (식대/교통비 별도)"
  status: 'recruiting' | 'closed';
  deadline: string;
  contactMethod: string;
  portfolioRequired: boolean;
}

export interface CommunityInfo {
  category: 'advice' | 'equipment' | 'scenario' | 'festival' | 'freetalk';
  isSolved: boolean;
  repliesCount: number;
}

export interface Post {
  id: string;
  boardType: BoardType;
  author: Author;
  title: string;
  content: string;
  images: string[];
  movieInfo?: MovieInfo;
  proInfo?: ProInfo;
  communityInfo?: CommunityInfo;
  hashtags: string[];
  likesCount: number;
  isLiked: boolean;
  bookmarksCount: number;
  isBookmarked: boolean;
  commentsCount: number;
  comments: Comment[];
  createdAt: string;
  tasteMatchScore?: number; // e.g. 98%
  aiRecommendationReason?: string;
}

export interface UserStats {
  userName: string;
  handle: string;
  cinephileLevelTitle: string;
  cinephileScore: number;
  watchedMoviesCount: number;
  writtenReviewsCount: number;
  scrapsCount: number;
  crewApplicationsCount: number;
  topGenres: Array<{ name: string; percentage: number; color: string }>;
  topDirectors: Array<{ name: string; worksWatched: number }>;
  activeTasteKeywords: string[];
  monthlyActivities: Array<{ month: string; logs: number }>;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: string;
  isMe?: boolean;
}

export interface ChatRoom {
  id: string;
  type: 'direct' | 'group';
  title: string;
  participantCount?: number;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  tag?: string;
}
