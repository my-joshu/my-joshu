import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SlidesToTextService } from './index';
import { logger } from '../logger';

// Mock dependencies
vi.mock('../logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('pdf-parse', () => {
  return {
    default: vi.fn().mockImplementation((buffer) => {
      if (buffer.toString() === 'error') {
        return Promise.reject(new Error('PDF parsing error'));
      }
      return Promise.resolve({
        text: 'PDF content extracted',
        numpages: 5,
      });
    }),
  };
});

// Mock dynamic imports
vi.mock('officeparser', () => {
  return {
    parseOfficeAsync: vi.fn().mockImplementation((buffer) => {
      if (buffer.toString() === 'error') {
        return Promise.reject(new Error('Office parsing error'));
      }
      return Promise.resolve('Office content extracted');
    }),
  };
});

describe('SlidesToTextService', () => {
  let service: SlidesToTextService;
  let validBuffer: Buffer;
  let errorBuffer: Buffer;

  beforeEach(() => {
    service = new SlidesToTextService();
    validBuffer = Buffer.from('valid content');
    errorBuffer = Buffer.from('error');
    vi.clearAllMocks();
  });

  describe('extractFromPdf', () => {
    it('should extract text from a PDF buffer successfully', async () => {
      const result = await service.extractFromPdf(validBuffer);

      expect(result.text).toBe('PDF content extracted');
      expect(result.metadata).not.toBeNull();
      expect(result.metadata!.pageCount).toBe(5);
      expect(result.metadata!.fileType).toBe('pdf');
      expect(result.error).toBeNull();
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('should handle errors during PDF extraction', async () => {
      const result = await service.extractFromPdf(errorBuffer);

      expect(result.text).toBeNull();
      expect(result.metadata).toBeNull();
      expect(result.error).toBe('PDF parsing error');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('extractText', () => {
    it('should process PDF files correctly', async () => {
      const result = await service.extractText(validBuffer, 'pdf', 'test.pdf');

      expect(result.text).toBe('PDF content extracted');
      expect(result.metadata).not.toBeNull();
      expect(result.metadata!.fileType).toBe('pdf');
      expect(logger.info).toHaveBeenCalled();
    });

    it('should process Office files correctly', async () => {
      const result = await service.extractText(validBuffer, 'pptx', 'test.pptx');

      expect(result.text).toBe('Office content extracted');
      expect(result.metadata).not.toBeNull();
      expect(result.metadata!.fileType).toBe('pptx');
      expect(logger.info).toHaveBeenCalled();
    });

    it('should handle unsupported file types', async () => {
      const result = await service.extractText(validBuffer, 'txt' as any, 'test.txt');

      expect(result.text).toBeNull();
      expect(result.error).toContain('Unsupported file type');
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle Office parsing errors', async () => {
      const result = await service.extractText(errorBuffer, 'pptx', 'error.pptx');

      expect(result.text).toBeNull();
      expect(result.error).toContain('Office parsing error');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('processExtractedText', () => {
    it('should clean up whitespace in extracted text', () => {
      const text = 'Line 1\n\n\n\nLine 2\n\n\nLine 3    with    spaces';
      const processed = service.processExtractedText(text);

      expect(processed).toBe('Line 1\n\nLine 2\n\nLine 3 with spaces');
    });

    it('should handle empty text', () => {
      expect(service.processExtractedText('')).toBe('');
      expect(service.processExtractedText(null as any)).toBe('');
    });
  });
});
