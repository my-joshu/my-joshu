import officeParser, { type OfficeParserConfig } from "officeparser";
import {
  MAX_FILE_SIZE_BYTE,
  MAX_FILE_SIZE_STRING,
  VALID_MIME_TYPES,
} from "@/shared/lib/constants";

const validateFile = (file: File): string | undefined => {
  const { size, type } = file;

  // Validate file type
  if (!VALID_MIME_TYPES.includes(type)) {
    return "Invalid file type";
  }

  // Validate file size
  if (size > MAX_FILE_SIZE_BYTE) {
    return `Maximum file size is ${MAX_FILE_SIZE_STRING}`;
  }
};

/**
 * Serverless Functions have a read-only filesystem with writable /tmp scratch space up to 500 MB.
 * https://vercel.com/docs/functions/runtimes#file-system-support
 *
 * Related issue: https://github.com/vercel/vercel/discussions/5320
 */
const createOfficeParserConfig = (): OfficeParserConfig => {
  const config: OfficeParserConfig = {};
  if (process.env.NODE_ENV === "production") {
    config.tempFilesLocation = "/tmp";
  }
  return config;
};

/** Currently office files only supported. */
export const extractText = async (file: File): Promise<string> => {
  try {
    const message = validateFile(file);
    if (message) {
      throw new Error(message);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const text = await officeParser.parseOfficeAsync(
      fileBuffer,
      createOfficeParserConfig()
    );

    return text.trim();
  } catch (error: unknown) {
    console.error("Error in extractText function:", error);
    throw new Error("Text extraction failed.");
  }
};
