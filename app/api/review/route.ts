import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { buildReviewPrompt } from '@/lib/review/prompt';

// 真正的 GTO 模型（例如使用 OpenAI）
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 本地 GTO 模型（簡單規則引擎）
function localGTOModel(hand: any) {
  // 假模型：根據 Hero 位置與手牌返回簡單的建議
  const heroHand = hand.heroHand.toUpperCase();
  const heroPosition = hand.heroPosition.toUpperCase();
  let gtoRecommendation = '';
  
  // 假設規則：根據位置和手牌推薦動作
  if (heroPosition === 'BTN') {
    if (['AHKH', 'AKQH'].includes(heroHand)) {
      gtoRecommendation = 'Raise';
    } else {
      gtoRecommendation = 'Fold';
    }
  } else if (heroPosition === 'CO') {
    gtoRecommendation = heroHand.includes('A') ? 'Call' : 'Fold';
  } else {
    gtoRecommendation = 'Fold';
  }

  // 返回簡單的分析
  return {
    overallGrade: 'B',
    summary: '此手牌在目前位置的表現可接受。',
    spots: [{
      street: 'Preflop',
      heroDecision: `Hero 決定：${gtoRecommendation}`,
      gtoRecommendation: `GTO 推薦：${gtoRecommendation}`,
      exploitRecommendation: `Exploit 建議：根據對手類型調整策略。`,
      severity: 'OK',
      keyTakeaways: ['根據位置選擇適合的開局範圍。'],
    }],
  };
}

export async function POST(req: NextRequest) {
  try {
    const hand = await req.json();

    // 檢查是否有 API 金鑰（用來判斷是否使用真正的 GTO 模型）
    const apiKey = req.headers.get('X-API-Key') || '';
    let result;

    if (apiKey) {
      // 如果有金鑰，使用真正的 GTO 模型
      const prompt = buildReviewPrompt(hand);
      const completion = await client.chat.completions.create({
        model: 'gpt-4.1-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: '你是專業撲克教練。' },
          { role: 'user', content: prompt },
        ],
      });

      const json = JSON.parse(completion.choices[0].message.content || '{}');
      result = json;
    } else {
      // 沒有金鑰，使用本地 GTO 模型
      result = localGTOModel(hand);
    }

    return NextResponse.json(result);

  } catch (err) {
    console.error("Review API Error:", err);
    return new NextResponse("Review API error", { status: 500 });
  }
}
