import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini if key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.error('Failed to init GoogleGenAI:', err);
  }
}

// AI Curation & Movie Analysis Proxy
app.post('/api/curate-ai', async (req: Request, res: Response) => {
  try {
    const { favoriteGenres = [], favoriteDirectors = [], userKeywords = [], currentPostTitle } = req.body;

    if (aiClient) {
      const prompt = `당신은 시네필을 위한 감각적인 영화 평론가이자 AI 영화 큐레이터 'CineLog AI'입니다.
사용자의 영화 취향 프로필:
- 선호 장르: ${favoriteGenres.join(', ') || '누아르, SF, 드라마'}
- 선호 감독: ${favoriteDirectors.join(', ') || '봉준호, 왕가위, 드니 빌뇌브'}
- 주요 취향 키워드: ${userKeywords.join(', ') || '미장센, 35mm필름, 철학적메시지'}
${currentPostTitle ? `- 현재 검토 중인 영화/작품: "${currentPostTitle}"` : ''}

요청:
1. 사용자의 영화 취향 성향에 대한 한 줄 시네마틱 분석 (예: "밤의 감수성과 날카로운 미장센을 사랑하는 심야의 시네필")
2. 오늘 밤 꼭 봐야 할 숨은 걸작 추천 2편 (영화 제목, 감독, 연도, 추천 이유 1줄)
3. 이 사용자에게 추천하는 영화적 시선 / 팁 1개

반드시 한국어로 자연스럽고 영화 매니아의 깊이 있는 어조로 JSON 형식으로만 답변하세요.
형식:
{
  "curatorOneLiner": "...",
  "tasteMatchScore": 96,
  "recommendations": [
    {"title": "...", "director": "...", "year": 2021, "reason": "..."},
    {"title": "...", "director": "...", "year": 2017, "reason": "..."}
  ],
  "cinematicInsight": "..."
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, data: parsed, isAiGenerated: true });
      } catch (parseErr) {
        console.warn('JSON parse fallback for AI output', parseErr);
      }
    }

    // High quality fallback curated response
    return res.json({
      success: true,
      isAiGenerated: false,
      data: {
        curatorOneLiner: '어둠 속 강렬한 대비와 깊은 미장센의 여운을 탐닉하는 네오 누아르 시네필',
        tasteMatchScore: 97,
        recommendations: [
          {
            title: '블레이드 러너 2049 (Blade Runner 2049)',
            director: '드니 빌뇌브 (Denis Villeneuve)',
            year: 2017,
            reason: '로저 디킨스의 압도적인 황금빛 미장센과 인간 실존에 대한 차가운 성찰',
          },
          {
            title: '화양연화 (In The Mood For Love)',
            director: '왕가위 (Wong Kar-wai)',
            year: 2000,
            reason: '스텝프린팅 촬영 기법과 첼로 선율이 직조해낸 찰나의 시네마토그래피',
          },
        ],
        cinematicInsight: '회원님의 최근 북마크 패턴은 촬영 기법(Cinematography)과 사운드 디자인의 조화에 높은 가중치를 두고 있습니다.',
      },
    });
  } catch (error: any) {
    console.error('AI curate error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Curation failed',
    });
  }
});

// Real-time Chat AI Cinephile Reply helper
app.post('/api/chat/cinephile-bot', async (req: Request, res: Response) => {
  try {
    const { roomName, userMessage } = req.body;
    if (aiClient && userMessage) {
      const prompt = `당신은 영화 SNS 'CineLog'의 영화 커뮤니티 채팅방 "${roomName}"에 상주하는 시네필 멘토 '시네마 살롱 마스터'입니다.
상대방 메시지: "${userMessage}"
짧고 위트 있으며 영화 매니아다운 1~2문장의 답장을 한국어로 작성하세요.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        success: true,
        reply: response.text?.trim() || '영화를 사랑하는 분들의 시선은 언제나 흥미롭네요!',
      });
    }

    return res.json({
      success: true,
      reply: '이 작품의 미장센과 조명 연출은 다시 봐도 경이롭네요! 어떤 장면에 가장 매료되셨나요?',
    });
  } catch (err: any) {
    return res.json({
      success: false,
      reply: '오늘 밤 함께 영화 이야기를 나눌 수 있어서 반갑습니다.',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CineLog] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
