import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Film, Sparkles, Award } from 'lucide-react';
import { UserStats } from '../types';

interface CinephileOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (updatedStats: Partial<UserStats>) => void;
}

export const CinephileOnboardingModal: React.FC<CinephileOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['네오 누아르', '35mm 아날로그 미학']);
  const [commitmentCheck, setCommitmentCheck] = useState(true);
  const [favoriteDirector, setFavoriteDirector] = useState('드니 빌뇌브 / 박찬욱');

  if (!isOpen) return null;

  const styleOptions = [
    '네오 누아르',
    '35mm 아날로그 미학',
    'SF / 디스토피아',
    '독립 예술 영화',
    '심리 스릴러',
    '프랑스 누벨바그',
    '한국 클래식 시네마',
    '다큐멘터리 / 실험영화',
  ];

  const handleToggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleFinish = () => {
    onComplete({
      cinephileScore: 920,
      activeTasteKeywords: [...selectedStyles.slice(0, 4), '시네마토그래피'],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12121a] border border-red-900/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#161622] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="text-sm font-bold text-white">CineLog 공식 시네필 입회 사전 검증</h2>
              <span className="text-[11px] text-zinc-400">오직 영화에 진심인 이들만을 위한 멤버십</span>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs text-zinc-300">
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-red-950/20 p-3 rounded-xl border border-red-900/30">
                <p className="text-zinc-300 leading-relaxed font-normal">
                  <span className="text-red-400 font-bold">Q1.</span> CineLog는 영화와 무관한 일상 사진 대신,{' '}
                  <span className="text-white font-semibold">오직 영화 정보, 미장센 분석, 스태프 구인구직</span>만을
                  다루는 순수 영화 전문 SNS입니다. 이에 동의하시나요?
                </p>
              </div>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={commitmentCheck}
                  onChange={(e) => setCommitmentCheck(e.target.checked)}
                  className="accent-red-600 mt-0.5 rounded cursor-pointer"
                />
                <span className="text-zinc-200 leading-snug">
                  네, 영화와 무관한 글을 게시하지 않으며 품격 있는 시네필 커뮤니티 문화를 지킬 것을 서약합니다.
                </span>
              </label>

              <div className="flex justify-end pt-2">
                <button
                  disabled={!commitmentCheck}
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold rounded-lg transition-colors"
                >
                  다음 단계 (취향 등록)
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-red-950/20 p-3 rounded-xl border border-red-900/30">
                <p className="text-zinc-300 leading-relaxed font-normal">
                  <span className="text-red-400 font-bold">Q2.</span> 가장 매료되는 영화적 미학과 장르 스타일을
                  선택해주세요. (맞춤 추천 알고리즘에 반영됩니다)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map((style) => {
                  const isSelected = selectedStyles.includes(style);
                  return (
                    <button
                      key={style}
                      onClick={() => handleToggleStyle(style)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                        isSelected
                          ? 'bg-red-950/60 border-red-600 text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{style}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-zinc-400 font-medium">인생 최고의 감독 또는 가장 감명 깊었던 작품:</label>
                <input
                  type="text"
                  value={favoriteDirector}
                  onChange={(e) => setFavoriteDirector(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg"
                >
                  이전
                </button>
                <button
                  onClick={handleFinish}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>공인 시네필 배지 발급 및 완료</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
