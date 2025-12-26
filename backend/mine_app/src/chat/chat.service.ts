// chat.service.ts
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatService {
  private readonly model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY missing in environment variables');
      throw new Error('GEMINI_API_KEY missing');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async chat(message: string, history?: { role: string; content: string }[]) {
    const historyText = (history || [])
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const prompt = `
You are a friendly chatbot in a website.

Conversation so far:
${historyText}

User: ${message}

Respond in a clear, concise way.
    `;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();

    return text;
  }
}
