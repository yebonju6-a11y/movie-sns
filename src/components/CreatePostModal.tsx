import React, { useState } from 'react';
import {
  X,
  Image as ImageIcon,
  Film,
  Briefcase,
  MessageCircleQuestion,
  Star,
  Plus,
  Check,
  Upload,
} from 'lucide-react';
import { BoardType, Post } from '../types';
import { PRESET_POST_IMAGES } from '../data/mockData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (newPost: Partial<Post>) => void;
  defaultBoard?: BoardType;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmitPost,
  defaultBoard = 'hobby',
}) => {
  const [boardType, setBoardType] = useState<BoardType>(defaultBoard);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_POST_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('영화리뷰, 미장센, 시네마');

  // Hobby fields
  const [movieTitle, setMovieTitle] = useState('');
  const [director, setDirector] = useState('');
  const [movieYear, setMovieYear] = useState('2024');
  const [genre, setGenre] = useState('누아르');
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');

  // Pro fields
  const [roleNeeded, setRoleNeeded] = useState('촬영감독');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectType, setProjectType] = useState<'단편영화' | '장편독립' | '웹드라마' | '광고/MV' | '학생졸업작품'>('단편영화');
  const [period, setPeriod] = useState('2026.11월 중 3회차');
  const [location, setLocation] = useState('서울 마포구 및 경기 일대');
  const [remuneration, setRemuneration] = useState('회차당 25만원 (식대/교통비 지원)');
  const [deadline, setDeadline] = useState('2026.11.15 마감');

  // Community fields
  const [communityCategory, setCommunityCategory] = useState<'advice' | 'equipment' | 'scenario' | 'festival' | 'freetalk'>('advice');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const finalImage = customImageUrl.trim() || selectedImage;
    const parsedHashtags = hashtagsStr
      .split(/[,\s#]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const basePost: Partial<Post> = {
      boardType,
      title: title.trim(),
      content: content.trim(),
      images: [finalImage],
      hashtags: parsedHashtags.length > 0 ? parsedHashtags : ['영화', '시네필'],
      likesCount: 1,
      isLiked: true,
      bookmarksCount: 0,
      isBookmarked: false,
      commentsCount: 0,
      comments: [],
      createdAt: '방금 전',
      tasteMatchScore: 95,
      aiRecommendationReason: '방금 회원님이 직접 작성하신 최신 시네마 포스트입니다.',
    };

    if (boardType === 'hobby') {
      basePost.movieInfo = {
        title: movieTitle || title,
        director: director || '미지정',
        year: parseInt(movieYear, 10) || 2024,
        genre,
        rating,
        stillUrl: finalImage,
        platform: '극장 / OTT',
        quote: quote || undefined,
      };
    } else if (boardType === 'pro') {
      basePost.proInfo = {
        roleNeeded,
        projectTitle: projectTitle || title,
        projectType,
        period,
        location,
        remuneration,
        status: 'recruiting',
        deadline,
        contactMethod: '인앱 1:1 메시지 문의',
        portfolioRequired: true,
      };
    } else if (boardType === 'community') {
      basePost.communityInfo = {
        category: communityCategory,
        isSolved: false,
        repliesCount: 0,
      };
    }

    onSubmitPost(basePost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12121a] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl text-zinc-100">
        {/* Header */}
        <div className="sticky top-0 bg-[#12121a]/95 backdrop-blur-md p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-white">새 시네마 게시물 작성</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 text-xs">
          {/* Board Type Selection Segment */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-bold block">게시판 선택</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBoardType('hobby')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                  boardType === 'hobby'
                    ? 'bg-red-950/60 border-red-600 text-white shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Film className="w-4 h-4 text-red-400" />
                <span className="font-bold">취미 영화 피드</span>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">리뷰 & 미장센</span>
              </button>

              <button
                type="button"
                onClick={() => setBoardType('pro')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                  boardType === 'pro'
                    ? 'bg-red-950/60 border-red-600 text-white shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span className="font-bold">스태프 모집</span>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">전문 구인구직</span>
              </button>

              <button
                type="button"
                onClick={() => setBoardType('community')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                  boardType === 'community'
                    ? 'bg-red-950/60 border-red-600 text-white shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <MessageCircleQuestion className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">고민상담 커뮤니티</span>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">장비 & 질의응답</span>
              </button>
            </div>
          </div>

          {/* Image Selector (Cinema Stills or Custom URL) */}
          <div className="space-y-2">
            <label className="text-zinc-300 font-bold flex items-center justify-between">
              <span>영화 스틸컷 / 이미지 선택</span>
              <span className="text-zinc-500 font-normal">프리셋 6종 또는 직접 입력</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_POST_IMAGES.map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedImage(img.url);
                    setCustomImageUrl('');
                  }}
                  className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${
                    selectedImage === img.url && !customImageUrl
                      ? 'border-red-600 ring-2 ring-red-600/50'
                      : 'border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  {selectedImage === img.url && !customImageUrl && (
                    <div className="absolute inset-0 bg-red-950/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Custom URL Option */}
            <input
              type="text"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="또는 원하는 이미지 URL 직접 입력 (선택)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Title & Content */}
          <div className="space-y-3">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">제목</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  boardType === 'hobby'
                    ? '예: 마침내 바다에 가라앉은 사랑의 잔상 — <헤어질 결심>'
                    : boardType === 'pro'
                    ? '예: [단편영화 스태프 모집] 20분 SF 심리스릴러 촬영감독님을 모십니다'
                    : '예: [고민상담] 독립영화 첫 제작 예산 분배 조언 구합니다'
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 font-medium"
              />
            </div>

            {/* Board-specific Form Fields */}
            {boardType === 'hobby' && (
              <div className="bg-[#171724] p-3 rounded-xl border border-zinc-800 space-y-2.5">
                <span className="text-[11px] font-bold text-red-400 block">영화 상세 정보 (취미 리뷰)</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-zinc-400 text-[10px]">영화 제목</label>
                    <input
                      type="text"
                      value={movieTitle}
                      onChange={(e) => setMovieTitle(e.target.value)}
                      placeholder="헤어질 결심"
                      className="w-full bg-zinc-900 border border-zinc-700/60 rounded p-1.5 text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-[10px]">감독</label>
                    <input
                      type="text"
                      value={director}
                      onChange={(e) => setDirector(e.target.value)}
                      placeholder="박찬욱"
                      className="w-full bg-zinc-900 border border-zinc-700/60 rounded p-1.5 text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-[10px]">개봉연도</label>
                    <input
                      type="number"
                      value={movieYear}
                      onChange={(e) => setMovieYear(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/60 rounded p-1.5 text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-[10px]">나의 별점</label>
                    <div className="flex items-center gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-amber-400"
                        >
                          <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400' : 'text-zinc-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-zinc-400 text-[10px]">기억에 남는 명대사 또는 한 줄 평</label>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="슬픔이 파도처럼 덮치는 사람이 있고..."
                    className="w-full bg-zinc-900 border border-zinc-700/60 rounded p-1.5 text-zinc-200"
                  />
                </div>
              </div>
            )}

            {boardType === 'pro' && (
              <div className="bg-[#171724] p-3 rounded-xl border border-zinc-800 space-y-2.5">
                <span className="text-[11px] font-bold text-amber-400 block">스태프 구인 정보 (전문 공고)</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-zinc-400 text-[10px]">모집 분야</label>
                    <input
                      type="text"
                      value={roleNeeded}
                      onChange={(e) => setRoleNeeded(e.target.value)}
                      placeholder="촬영 / 조명 / 동시녹음 / 배우"
                      className="w-full bg-zinc-900 border border-zinc-700/60 rounded p-1.5 text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-[10px]">작품 형태</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-700/60 rounded p-1.5 text-zinc-200"
                    >
                      <option value="단편영화">단편영화</option>
                      <option value="장편독립">장편독립</option>
                      <option value="웹드라마">웹드라마</option>
                      <option value="학생졸업작품">학생졸업작품</option>
                      <option value="광고/MV">광고/MV</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-400 text-[10px]">마감일자</label>
                    <input
                      type="text"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/60 rounded p-1.5 text-zinc-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-zinc-400 text-[10px]">촬영 일정 및 회차</label>
                    <input
                      type="text"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/60 rounded p-1.5 text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-[10px]">페이 및 지원 조건</label>
                    <input
                      type="text"
                      value={remuneration}
                      onChange={(e) => setRemuneration(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/60 rounded p-1.5 text-zinc-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {boardType === 'community' && (
              <div className="bg-[#171724] p-3 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 block">고민상담 분류</span>
                <select
                  value={communityCategory}
                  onChange={(e) => setCommunityCategory(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded p-2 text-zinc-200"
                >
                  <option value="advice">영화 고민상담 & 진로</option>
                  <option value="equipment">카메라·장비 렌탈 노하우</option>
                  <option value="scenario">시나리오 및 연출 피드백</option>
                  <option value="festival">영화제 출품 정보</option>
                  <option value="freetalk">시네필 자유수다</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-zinc-300 font-bold block mb-1">상세 내용 (인스타그램 캡션 형식)</label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="영화에 대한 깊이 있는 감상, 미장센 분석, 혹은 스태프 모집 세부 요건을 자유롭게 작성하세요..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 leading-relaxed font-normal"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-[10px] block mb-1">해시태그 (쉼표로 구분)</label>
              <input
                type="text"
                value={hashtagsStr}
                onChange={(e) => setHashtagsStr(e.target.value)}
                placeholder="미장센, 독립영화, 왕가위, 스태프구인"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/50 transition-all flex items-center gap-1.5"
            >
              <span>게시물 공유하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
