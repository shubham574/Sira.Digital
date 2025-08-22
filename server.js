// Combined server.js: Serve Notion API + static assets (public, Assets, Fonts)

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.DATABASE_ID;

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'Assets')));
app.use('/fonts', express.static(path.join(__dirname, 'Fonts')));
app.use(cors());

// Notion API endpoint
app.get('/api/blogs', async (req, res) => {
  try {
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    });

    const data = await notionRes.json();
    if (!Array.isArray(data.results)) {
      return res.status(500).json({ error: 'Unexpected Notion response', raw: data });
    }

    const blogs = data.results.map(page => ({
      title: page.properties?.Name?.title?.[0]?.plain_text || 'Untitled',
      date: page.properties?.Date?.date?.start || 'No date',
      notes: page.properties?.Notes?.rich_text?.[0]?.plain_text || '',
      tags: page.properties?.Tags?.multi_select?.map(t => t.name) || [],
      url: page.url
    }));

    res.json(blogs);
  } catch (err) {
    console.error("❌ Error fetching from Notion:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

// Default route serves public/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
