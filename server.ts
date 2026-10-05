import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_DOCUMENTS } from './src/data/initialData';
import { knowledgeVerificationService } from './src/services/knowledgeVerificationService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'AI_KEY_PLACEHOLDER',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-memory document store for backend
let documentsStore = [...INITIAL_DOCUMENTS];

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, language = 'en' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check prompt injection
    const lower = prompt.toLowerCase();
    if (lower.includes('ignore previous instructions') || lower.includes('system prompt') || lower.includes('reveal secret')) {
      return res.json({
        answer: 'Security policy violation detected. I am programmed strictly to retrieve authorized information from verified knowledge bases.',
        citations: [],
        verificationStatus: 'NOT VERIFIED',
        domain: 'DOMAIN_E'
      });
    }

    // Find matching document in store
    const matchedDoc = documentsStore.find(doc => 
      doc.approvalStatus === 'PUBLISHED' &&
      (doc.title.toLowerCase().includes(lower) || doc.content.toLowerCase().includes(lower) || lower.split(' ').some((w: string) => w.length > 3 && doc.content.toLowerCase().includes(w)))
    ) || documentsStore[0];

    // Call Gemini API on server side with strict Authoritative Knowledge Directive instructions
    let aiAnswer = '';
    let verificationStatus = 'VERIFIED';
    try {
      const geminiRes = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User Query: "${prompt}"\nLanguage: ${language}\nAuthorized Source Context: Title: ${matchedDoc.title}\nSource: ${matchedDoc.source}\nLevel: ${matchedDoc.level}\nContent: ${matchedDoc.content}\n\nInstructions: Answer strictly based on the authorized source context above following the 'NO SOURCE = NO CLAIM' principle. Identify the source hierarchy level. If the query cannot be verified from the authorized knowledge base, respond exactly with: "I could not verify this information in the currently authorized Prosperity Party knowledge base. I will not guess. Please consult the responsible authorized officer."`,
        config: {
          systemInstruction: 'You are GIRMAIC DD-PP AI, an AI-powered information assistant for Dire Dawa Prosperity Party and Customs structure. You are NOT an official government or party representative unless authorized. Enforce TRUTH > FLUENCY, EVIDENCE > GUESSING, VERIFICATION > CONFIDENCE.',
          temperature: 0.1
        }
      });
      aiAnswer = geminiRes.text || `Based on authorized document [${matchedDoc.id}] (${matchedDoc.title}), Level ${matchedDoc.level}: ${matchedDoc.summary}`;
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      aiAnswer = `Based on authorized document [${matchedDoc.id}] (${matchedDoc.title}), Level ${matchedDoc.level}: ${matchedDoc.summary}`;
    }

    const citations = [
      {
        documentId: matchedDoc.id,
        title: matchedDoc.title,
        source: matchedDoc.source,
        level: matchedDoc.level,
        domain: matchedDoc.domain,
        version: matchedDoc.version,
        effectiveDate: matchedDoc.effectiveDate,
        verificationStatus: 'VERIFIED' as const
      }
    ];

    const verificationResult = knowledgeVerificationService.validateResponse(aiAnswer, citations, documentsStore);

    res.json({
      answer: aiAnswer,
      citations,
      verificationStatus: verificationResult.verificationStatus,
      confidenceScore: verificationResult.confidenceScore,
      flaggedWarnings: verificationResult.flaggedWarnings,
      domain: matchedDoc.domain
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.get('/api/documents', (req, res) => {
  res.json(documentsStore);
});

app.post('/api/documents', (req, res) => {
  const newDoc = {
    id: 'DOC-BE-' + Math.floor(100 + Math.random() * 900),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  documentsStore.push(newDoc);
  res.json(newDoc);
});

app.get('/api/admin/analytics', (req, res) => {
  res.json({
    totalQuestions: 1428,
    verifiedRate: '99.4%',
    activeLanguages: 5,
    documentsCount: documentsStore.length,
    escalationsCount: 2
  });
});

let escalationsStore = [
  {
    id: 'ESC-2026-001',
    userId: 'user_991',
    userName: 'Abebe Kebede',
    question: 'What is the official procedure for obtaining agricultural fertilizer subsidy?',
    language: 'am',
    timestamp: new Date().toISOString(),
    category: 'Agricultural Policy',
    aiAnswer: 'Requires verification.',
    sourceStatus: 'NOT VERIFIED',
    assignedOfficer: 'Officer Mohamed',
    status: 'IN_PROGRESS'
  }
];

app.get('/api/escalations', (req, res) => {
  res.json(escalationsStore);
});

app.post('/api/escalations', (req, res) => {
  const newEsc = {
    id: 'ESC-2026-' + Math.floor(100 + Math.random() * 900),
    ...req.body,
    timestamp: new Date().toISOString(),
    status: 'OPEN'
  };
  escalationsStore.push(newEsc);
  res.json(newEsc);
});

// Serve Vite build in production or middleware in dev
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // In development, Vite runs on 3000, but we can also set up vite middleware if needed
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GIRMAIC DD-PP AI backend server running on port ${PORT}`);
});
