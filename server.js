

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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'あなたは株式会社DorVisionのAIアシスタントです。SNS運用・Web制作・動画制作・企業ブランディング支援について丁寧に案内してください。和歌山県を拠点とする会社です。最終的にはお問い合わせページ（https://dorvision.co.jp/contact）への誘導をしてください。',
        messages: req.body.messages
      })
    });
    const data = await response.json();
    res.json({ reply: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: 'エラーが発生しました' });
  }
};