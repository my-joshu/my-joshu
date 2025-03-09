import { Buffer } from 'buffer';
import pdfParse from 'pdf-parse';
import { logger } from '../logger';

// Types for slide parsing
export interface SlidesToTextResult {
  text: string;
  metadata: {
    pageCount: number;
    fileType: string;
    fileSize: number;
  };
  error?: null;
}

export interface SlidesToTextError {
  text: null;
  metadata: null;
  error: string;
}

export type SlidesToTextResponse = SlidesToTextResult | SlidesToTextError;

// Supported file types
export type SupportedFileType = 'pdf' | 'pptx' | 'docx';

/**
 * Service for extracting text content from presentation files
 */
export class SlidesToTextService {
  constructor() { }

  /**
   * Extract text from a PDF file
   */
  async extractFromPdf(buffer: Buffer): Promise<SlidesToTextResponse> {
    try {
      const result = await pdfParse(buffer);

      return {
        text: result.text,
        metadata: {
          pageCount: result.numpages,
          fileType: 'pdf',
          fileSize: buffer.length,
        },
        error: null,
      };
    } catch (error) {
      logger.error({ error }, 'Error extracting text from PDF');
      return {
        text: null,
        metadata: null,
        error: error instanceof Error ? error.message : 'Unknown error processing PDF',
      };
    }
  }

  /**
   * Extract text from a file buffer based on file type
   */
  async extractText(
    buffer: Buffer,
    fileType: SupportedFileType,
    fileName?: string
  ): Promise<SlidesToTextResponse> {
    logger.info({ fileType, fileName, fileSize: buffer.length }, 'Starting text extraction');

    try {
      // Process based on file type
      switch (fileType.toLowerCase() as SupportedFileType) {
        case 'pdf':
          return await this.extractFromPdf(buffer);

        case 'pptx':
        case 'docx':
          // Use officeparser from existing dependencies (already in package.json)
          try {
            // Import dynamically to avoid dependency issues
            const officeParser = await import('officeparser');

            // Pass buffer directly to officeparser
            const extractedText = await officeParser.parseOfficeAsync(buffer);

            return {
              text: extractedText,
              metadata: {
                pageCount: -1, // Can't determine page count easily from officeparser
                fileType: fileType.toLowerCase(),
                fileSize: buffer.length,
              },
              error: null,
            };
          } catch (officeError) {
            logger.error({ error: officeError }, `Error extracting text from ${fileType}`);
            return {
              text: null,
              metadata: null,
              error: officeError instanceof Error ? officeError.message : `Unknown error processing ${fileType}`,
            };
          }

        default:
          logger.error({ fileType }, 'Unsupported file type');
          return {
            text: null,
            metadata: null,
            error: `Unsupported file type: ${fileType}`,
          };
      }
    } catch (error) {
      logger.error({ error, fileType }, 'Error in text extraction');
      return {
        text: null,
        metadata: null,
        error: error instanceof Error ? error.message : 'Unknown error in text extraction',
      };
    }
  }

  /**
   * Process extracted text to improve quality
   * - Remove excessive whitespace
   * - Split into sections
   * - Identify headers
   */
  processExtractedText(text: string): string {
    if (!text) return '';

    // Basic processing
    let processed = text
      // Replace multiple newlines with single newline
      .replace(/\n{3,}/g, '\n\n')
      // Replace multiple spaces with single space
      .replace(/[ \t]{2,}/g, ' ')
      // Trim whitespace
      .trim();

    return processed;
  }
}

// Export a singleton instance
export const slidesToTextService = new SlidesToTextService();
