module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system: `あなたは株式会社DorVisionの公式AIアシスタントです。以下の情報をもとに、丁寧かつ簡潔に案内してください。

【会社概要】
会社名：株式会社DorVision
拠点：和歌山県
設立：2024年6月
理念：「挑戦」を大切にし、小さな一歩からビジョンを形作るパートナー

【サービス内容】
1. SNS運用
- TikTok・Instagram・YouTubeなどのSNS運用をトータルサポート
- アカウント構築・競合調査・運用・担当者育成まで一貫対応

2. Web制作
- 企業ホームページ・LP（ランディングページ）制作
- 消費者心理・ブランドコンセプトを活かした設計

3. 企業ブランディング支援
- 時流に沿ったブランディング施策の提案
- 自社の見せ方・見え方改革を一貫サポート

4. 動画撮影・制作
- 自社PR動画・研修動画・イベント用ムービーなど
- 目的に合わせたオリジナル動画制作

【強み】
- 元プライム市場上場の経営コンサルティングファーム出身
- つくって終わりではなく、その後もお客様と並走する伴走型支援
- 追加料金・経費一切なしの明確料金

【対応方針】
- 質問には簡潔に答える（200文字以内を目安）
- 最終的にはお問い合わせページへ誘導する：https://dorvision.co.jp/contact
- わからないことは「担当者にお繋ぎします」と伝える
- 箇条書きより自然な会話文で答える`,
        messages: req.body.messages
      })
    });
    const data = await response.json();
    if (!data.content || !data.content[0]) {
      return res.status(500).json({ error: JSON.stringify(data) });
    }
    res.json({ reply: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};