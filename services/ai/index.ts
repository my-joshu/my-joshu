import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';
import { env } from 'process';
import { logger } from '../logger';

// Types for hint generation
export interface HintGenerationParams {
  presentationContent: string;
  question: string;
  maxTokens?: number;
  temperature?: number;
}

export interface HintResult {
  hint: string;
  error?: null;
}

export interface HintError {
  hint: null;
  error: string;
}

export type HintResponse = HintResult | HintError;

// Default configuration for hint generation
const DEFAULT_GENERATION_CONFIG: GenerationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

// Base prompt template for generating answer hints
const BASE_PROMPT_TEMPLATE = `
You are a helpful AI assistant designed to help speakers during Q&A sessions. Your task is to provide concise,
informative hints that will help the speaker answer questions about their presentation.

Based on the presentation content and the question, provide a brief hint that will help the speaker formulate
their answer. Your hint should:
- Be concise (3-5 sentences)
- Include relevant facts and context from the presentation
- Suggest a potential structure for the answer
- Be helpful without giving a complete answer (the speaker should add their expertise)

PRESENTATION CONTENT:
{{presentationContent}}

QUESTION FROM AUDIENCE:
{{question}}

HINT FOR SPEAKER:
`;

/**
 * AI service for generating answer hints using Google's Generative AI
 */
export class AIService {
  private model: GenerativeModel | null = null;
  private isInitialized = false;

  /**
   * Initialize the AI service with the Gemini API key
   */
  constructor(private apiKey?: string) {
    this.initialize();
  }

  /**
   * Initialize the generative model
   */
  private initialize(): void {
    try {
      const apiKey = this.apiKey || env.GEMINI_API_KEY;

      if (!apiKey) {
        logger.error('Missing Gemini API key. AI service will not function properly.');
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      // Update to use gemini-1.5-flash model which is available in the current API version
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.isInitialized = true;
      logger.info('AI service initialized successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize AI service');
    }
  }

  /**
   * Generate an answer hint based on presentation content and question
   */
  async generateHint(params: HintGenerationParams): Promise<HintResponse> {
    if (!this.isInitialized || !this.model) {
      this.initialize();

      if (!this.isInitialized || !this.model) {
        return {
          hint: null,
          error: 'AI service not initialized. Check API key and try again.'
        };
      }
    }

    try {
      // Prepare the prompt
      const prompt = BASE_PROMPT_TEMPLATE
        .replace('{{presentationContent}}', params.presentationContent)
        .replace('{{question}}', params.question);

      // Configure generation parameters
      const generationConfig: GenerationConfig = {
        ...DEFAULT_GENERATION_CONFIG,
        temperature: params.temperature || DEFAULT_GENERATION_CONFIG.temperature,
        maxOutputTokens: params.maxTokens || DEFAULT_GENERATION_CONFIG.maxOutputTokens,
      };

      // Generate the content
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      const text = response.text();

      logger.info({
        question: params.question.substring(0, 50) + (params.question.length > 50 ? '...' : ''),
        hintLength: text.length,
      }, 'Generated answer hint successfully');

      return { hint: text, error: null };
    } catch (error) {
      logger.error({ error, question: params.question }, 'Error generating answer hint');
      return {
        hint: null,
        error: error instanceof Error ? error.message : 'Unknown error generating hint'
      };
    }
  }
}

// Export a singleton instance
export const aiService = new AIService();
