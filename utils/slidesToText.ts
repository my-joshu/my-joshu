import path from "path";
import officeParser from "officeparser";
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

/** Currently office files only supported. */
export const extractText = async (file: File): Promise<string> => {
  try {
    const message = validateFile(file);
    if (message) {
      throw new Error(message);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    /**
     * Serverless Functions have a read-only filesystem with writable /tmp scratch space up to 500 MB.
     * https://vercel.com/docs/functions/runtimes#file-system-support
     *
     * You need to specify `tmp/` directory as a temporary file location to officeParser
     */
    const officeParserTmpDir = path.join(process.cwd(), "tmp/officeParser");
    const text = await officeParser.parseOfficeAsync(fileBuffer, {
      tempFilesLocation: officeParserTmpDir,
    });

    return text.trim();
  } catch (error: unknown) {
    console.error("Error in extractText function:", error);
    throw new Error("Text extraction failed.");
  }
};
