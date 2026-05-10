require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/api/chat', async (req, res) => {
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
});

app.listen(3000, () => {
  console.log('サーバーが起動しました: http://localhost:3000');
});